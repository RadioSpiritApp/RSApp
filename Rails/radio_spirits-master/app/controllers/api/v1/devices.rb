module API
  module V1
    class Devices < API::V1::Base
      include API::V1::Defaults

      resource :devices do
        helpers do
          def get_redirect_page_details(device)
            device_onboarding_bucket = device.onboarding_bucket
            device_lifetime = (Time.current.to_date - device.created_at.to_date).to_i
            page_name = ''
            sections_details = {}
            sections_details[:show_email] = device_onboarding_bucket.show_signup
            sections_details[:show_skip] = device_lifetime < (device_onboarding_bucket.show_signup_after + device_onboarding_bucket.skip_signup_for)
            sections_details[:show_rv_login] = device_onboarding_bucket.show_rv_login
            if device.user.present?
              page_name = 'homepage'
            else
              if device_onboarding_bucket.show_signup_after == 0 || device_lifetime >= device_onboarding_bucket.show_signup_after
                page_name = 'signup'
              else
                page_name = 'homepage'
              end
            end
            return page_name, sections_details
          end
        end

        desc "Create Device", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :device, type: Hash, desc: 'Device object' do
            requires :udid, type: String, desc: "Unique Device Id"
            requires :device_name, type: String, desc: "Device Name"
            requires :fcm_token, type: String, desc: "FCM Token"
            requires :device_type, type: String, desc: "Device Type"
            requires :device_locale, type: String, desc: "Device Locale"
            requires :timezone, type: String, desc: "Timezone"
          end
        end
        post :create do
          success = true
          @device = Device.find_by(udid: params[:device][:udid])
          message = "Device found successfully"
          if @device.nil?
            if OnboardingBucket.active.present?
              @device = Device.new(params[:device])
              if @device.save
                @device.allocate_onboarding_bucket
                @device.allocate_subscription_bucket
                message = "Device Created successfully."
              else
                success = false
                message = error_message(@device)
              end
            else
              success = false
              message = "Something went wrong. Please try later"
            end
          else
            @device.access_tokens.each do |token|
              Device.find(token.device_id).update(user_id: nil)
              token.destroy
            end
          end
          if success
            page_name, sections_details = get_redirect_page_details(@device)
            user = {}
            if @device.user.present? && @device.confirmed?
              options[:access_token] = @device.user.access_tokens.last&.token
              access_token = AccessToken.find_by_token(options[:access_token])
              options[:is_paid_user] = @device.user.has_active_subscription_on?(@device.device_type, access_token)
              options[:user_type] = @device.user.has_active_subscription_on?(@device.device_type, access_token) ? @device.user.get_user_type(access_token) : 'RadioSpirits'
              options[:page_details] = @device.get_bucket_details rescue {}
              user = UserSerializer.new(@device.user, scope: options)
            end
            {success: true, message: message, redirect_to: page_name, page_details: sections_details, user: user}
          else
            { success: false, message: message }
          end
        end

        desc "Check Email confirmation", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :udid, type: String, desc: "Unique Device Id"
        end
        get :email_confirmed do
          @device = Device.find_by(udid: params[:udid])
          if @device.present?
            page_name, sections_details = get_redirect_page_details(@device)
            if @device.user.present?
              options[:access_token] = @device.user.access_tokens.where(device_id: @device.id).last&.token
              access_token = AccessToken.find_by_token(options[:access_token]).token
              options[:is_paid_user] = @device.user.has_active_subscription_on?(@device.device_type, access_token)
              options[:user_type] = @device.user.has_active_subscription_on?(@device.device_type, access_token) ? @device.user.get_user_type(access_token) : 'RadioSpirits'
              {success: true, message: "", redirect_to: page_name, user: UserSerializer.new(@device.user, scope: options)}
            else
              {success: true, message: "", redirect_to: page_name, sections_details: sections_details, user: {}}
            end
          else
            { success: false, message: "This device is not registered" }
          end
        end

        desc "Get Device Reference Id", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :device, type: Hash, desc: 'Device object' do
            requires :udid, type: String, desc: "Unique Device Id"
          end
        end
        get :reference_id do
          @device = Device.find_by(udid: params[:device][:udid])
          error!({ success: false, message: 'This device is not registered' }, 400) if @device.blank?
          { success: true, message: "Reference Id fetched successfully", reference_id: @device.reference_id}
        end
      end
    end
  end
end
