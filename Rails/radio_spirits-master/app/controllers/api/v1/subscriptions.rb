module API
  module V1
    class Subscriptions < API::V1::Base
      include API::V1::Defaults

      helpers do
        def generate_access_token_for_user(user_id, device_id)
          AccessToken.where(device_id: device_id).destroy_all
          @access_token = AccessToken.create(user_id: user_id, device_id: device_id).token
        end

        def validate_receipt(params)
          is_valid = true
          @expiry_date = Time.current
          @auto_renewing = true
          if params[:platform] == 'ios'
            config = CandyCheck::AppStore::Config.new(
              environment: Rails.env.production? ? :production : :sandbox
            )
            verifier = CandyCheck::AppStore::Verifier.new(config)
            response = verifier.verify(params[:transaction_receipt], $secret[:ios_app_secret])
            return false unless response.valid?

            Rails.logger.debug("===========Receipt Validation:: #{response}===========")
            # @expiry_date = Time.zone.at(response.attributes['in_app'].map{|in_app| in_app['purchase_date_ms'] if in_app['original_transaction_id'].eql?(params[:transaction_identifier])}.sort.last.to_i/1000)
            # response_records = response.attributes['in_app'].select{|in_app| in_app['original_transaction_id'].eql?(params[:transaction_identifier])}
            response_records = response.attributes['in_app']
            @expiry_date = Time.zone.at(response_records.sort_by{|key| key['purchase_date_ms']}.last['expires_date_ms'].to_i/1000) rescue Time.current
          elsif params[:platform] == 'android'
            # config = CandyCheck::PlayStore::Config.new(
            #   application_name: $secret[:playstore_application_name],
            #   application_version: $secret[:playstore_application_version],
            #   issuer: $secret[:playstore_issuer],
            #   key_file: $secret[:playstore_key_file],
            #   key_secret: $secret[:playstore_key_secret]
            # )
            # verifier = CandyCheck::PlayStore::Verifier.new(config)
            # verifier.boot!
            # response = verifier&.verify_subscription($secret[:playstore_package], params[:product_id], params[:transaction_receipt])

            authorization = CandyCheck::PlayStore.authorization($secret[:playstore_key_file])
            verifier = CandyCheck::PlayStore::Verifier.new(authorization: authorization)
            response = verifier.verify_subscription_purchase(
              package_name: $secret[:playstore_package],
              subscription_id: params[:product_id],
              token: params[:transaction_receipt]
            )
            return false if response.nil?

            Rails.logger.debug("===========Receipt Validation:: #{response}===========")
            @auto_renewing = response.auto_renewing?
            @expiry_date = Time.zone.at(response.expiry_time_millis / 1000)
          end
          is_valid
        end

        def return_user_details(user, device, message)
          options = {}
          options[:access_token] = @access_token
          access_token = AccessToken.find_by_token(@access_token)
          options[:is_paid_user] = user.has_active_subscription_on?(device&.device_type, access_token)
          options[:user_type] = user.has_active_subscription_on?(device&.device_type, access_token) ? user.get_user_type(access_token) : 'RadioSpirits'
          options[:page_details] = device.get_bucket_details rescue {}
          response = { success: true, message: message, user: UserSerializer.new(user, scope: options)}
          response[:user_confirmed] = user.confirmed_on_device(device.udid)
          response[:redirect_to] = 'homepage'
          response
        end
      end

      resource :subscriptions do
        desc "Create Subscriptions", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :udid, type: String, desc: "Unique Device Id"
          requires :transaction_identifier, type: String, desc: "Original Transaction Identifier"
          requires :product_id, type: String, desc: "Product Id"
          requires :transaction_date, type: String, desc: "Original Transaction Date"
          requires :subscription_type, type: String, desc: "Define type of request Restore/Purchase"
          requires :transaction_receipt, type: String, desc: "Transaction Receipt"
          optional :platform, type: String, desc: "Phone OS"
          optional :email, type: String, desc: "Email"
        end
        post do
          device = Device.with_udid(params[:udid]).first
          error!({ success: false, message: 'This device is not registered', redirect_to: 'signup' }, 400) if device.blank?
          error!({ success: false, message: 'Transaction receipt is invalid!', redirect_to: 'signup' }, 400) unless validate_receipt(params)
          error!({ success: false, message: "Invalid subscription type request.", redirect_to: 'signup'}, 400) unless ['purchase', 'restore'].include?(params[:subscription_type].downcase)
          plan = device.get_plan_id_for(params[:product_id])
          original_transaction_date = DateTime.strptime(params[:transaction_date].to_s, '%Q')
          if device.user.blank?
            @user = User.find_by(email: params[:email]) if params[:email].present?
            if @user.present?
              device.update(user_id: @user.id)
              generate_access_token_for_user(@user.id, device.id)
              if @user.devices.count > 3
                logout_from_existing_session(user.access_tokens.order(:id).first)
              end
            else
              @user = User.find_or_initialize_by(transaction_identifier: params[:transaction_identifier])
              @user.skip_password_validation = true
              @user.role = User::SUBSCRIBER
              @user.email = params[:email] if params[:email].present?
              if @user.save
                device.update(user_id: @user.id)
                generate_access_token_for_user(@user.id, device.id)
              end
            end
          else
            @user = device.user
            @user.update(transaction_identifier: params[:transaction_identifier])
            @access_token = AccessToken.where(user_id: @user.id, device_id: device.id).first&.token
            generate_access_token_for_user(@user.id, device.id) if @access_token.blank?
          end
          if plan.present?
            @subscription = @user.subscription_with_identifier(params[:transaction_identifier]).last
            if @subscription.blank?
              @subscription = @user.subscriptions.create(
                plan_id: plan.id,
                expiry_date: @expiry_date, #original_transaction_date + plan.validity.days
                transaction_identifier: params[:transaction_identifier],
                transaction_date: original_transaction_date,
                platform: device.device_type,
                auto_renewal: @auto_renewing,
                transaction_receipt: params[:transaction_receipt]
              )
            else
              existing_user = @subscription.user
              error!({ success: false, message: 'User suspended. Contact Administrator', redirect_to: 'signup' }, 403) if existing_user.present? && existing_user.suspended?

              @subscription.plan_id = plan.id
              @subscription.expiry_date = @expiry_date # original_transaction_date + plan.validity.days
              @subscription.transaction_date = original_transaction_date
              @subscription.auto_renewal = @auto_renewing
              @subscription.transaction_receipt = params[:transaction_receipt]
              @subscription.save

              error!({ success: false, message: 'Expired Subscription', redirect_to: 'signup' }, 400) unless @subscription.is_active?
              if @user.devices.count > 3
                first_token = @user.access_tokens.order(:id).first
                first_device = first_token.device
                AccessToken.where(user_id: @user.id, device_id: first_device.id).destroy_all
                Device.find(first_device.id).update(user_id: nil)
              end
            end
          end
          success_message = params[:subscription_type].downcase == 'purchase' ? 'Subscribed successfully!' : 'Subscription restored succssfully!'
          return_user_details(@user, device, success_message)
        end

        post :callback do
          Rails.logger.debug("===========Subscription Callback:: #{params.inspect}===========")
          if params['latest_receipt_info'].present? && params['latest_receipt_info']['original_transaction_id']
            subscription = Subscription.find_by(platform: 'ios',
                                                transaction_identifier: params['latest_receipt_info']['original_transaction_id'])
            subscription&.update(auto_renewal: params['auto_renew_status'])
          end
        end
      end
    end
  end
end
