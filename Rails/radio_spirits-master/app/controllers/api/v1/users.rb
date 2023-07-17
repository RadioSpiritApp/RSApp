module API
  module V1
    class Users < API::V1::Base
      include API::V1::Defaults

      helpers do
        def generate_access_token_for_user(user, device_id, expire = false)
          AccessToken.where(device_id: device_id).destroy_all
          subscription = user.subscriptions.where(type: Subscription::RV).last if expire
          @access_token = AccessToken.create(user_id: user.id, device_id: device_id, expiry_date: subscription&.expiry_date)
        end

        def logout_from_existing_session(access_token)
          Device.find(access_token.device_id).update(user_id: nil)
          access_token.destroy
        end

        def responde_user_details(user, message, token, show_confirmation=false, device_udid=nil)
          options = {}
          options[:access_token] = token
          access_token = AccessToken.find_by_token(token)
          device = Device.with_udid(device_udid).first
          options[:user_type] = user.has_active_subscription_on?(device&.device_type, access_token) ? user.get_user_type(access_token) : 'RadioSpirits'
          options[:is_paid_user] = user.has_active_subscription_on?(device&.device_type, access_token)
          options[:page_details] = device.get_bucket_details rescue {}
          response = { success: true, message: message, user: UserSerializer.new(user, scope: options)}
          response[:user_confirmed] = user.confirmed_on_device(device_udid)
          response
        end

        def validate_google_auth_token(auth_uid, auth_token)
          # https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=auth_token
          response = HTTParty.get("https://www.googleapis.com/oauth2/v2/userinfo", headers: {"Access_token"  => auth_token, "Authorization" => "OAuth #{auth_token}"})
          error!({ success: false, message: 'Invalid auth token' }, 400) unless response.code == 200
          error!({ success: false, message: 'Invalid auth uid' }, 400) unless response['id'] == auth_uid
          true
        end
      end

      resource :users do
        desc "Signup user", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash, desc: 'User object' do
            requires :email, type: String, desc: "Email"
            requires :udid, type: String, desc: "Unique Device Id"
            optional :first_name, type: String, desc: "First Name"
            optional :last_name, type: String, desc: "Last Name"
          end
        end
        post :sign_up do
          device = Device.with_udid(params[:user][:udid]).first
          error!({ success: false, message: 'This device is not registered' }, 400) if device.blank?
          params[:user][:email].downcase!
          existing_user = Subscriber.find_by_email(params[:user][:email])
          error!({ success: false, message: 'User suspended. Contact Administrator' }, 403) if existing_user.present? && existing_user.suspended?
          user = Subscriber.authenticate(params[:user][:email], params[:user][:udid])
          if user.present?
            device.update(user_id: user.id) if (device.user_id != user.id)
            generate_access_token_for_user(user, device.id)
            if user.devices.count > 3
              logout_from_existing_session(user.access_tokens.order(:id).first)
            end
            #EmailConfirmation.where("user_id = ? OR device_id = ?", user.id, device.id).destroy_all
            responde_user_details(user, "Logged In Successfully", @access_token.token, true, params[:user][:udid])
          else
            user = User.find_by(email: params[:user][:email])
            if user.blank?
              user = User.new(params[:user].slice(:email, :first_name, :last_name))
              user.skip_password_validation = true
              user.role = User::SUBSCRIBER
              user.save
              user.send_email_confirmation(device.id)
              device.update(user_id: user.id) if (device.user_id != user.id)
              generate_access_token_for_user(user, device.id)
              responde_user_details(user, "Please verify your email", @access_token.token, true, params[:user][:udid])
            else
              if user.has_active_subscription_on?(device&.device_type, @access_token)
                { success: false, message: "You are already Subscribed. Please restore your subscription" }
              else
                user.send_email_confirmation(device.id) if user.email_verification_pending?
                device.update(user_id: user.id) if (device.user_id != user.id)
                generate_access_token_for_user(user, device.id)
                if user.devices.count > 3
                  logout_from_existing_session(user.access_tokens.order(:id).first)
                end
                responde_user_details(user, user.email_verification_pending? ? "Please verify your email" : "Logged In Successfully", @access_token.token, true, params[:user][:udid])
              end
            end
          end
        end

        desc "Login for RV user.", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :email, type: String, desc: "Email"
          requires :password, type: String, desc: "Password"
          requires :udid, type: String, desc: "Unique Device ID"
        end
        post :rv_login do
          params[:email].downcase!
          device = Device.with_udid(params[:udid]).first
          error!({ success: false, message: 'This device is not registered' }, 400) if device.blank?
          existing_user = Subscriber.find_by_email(params[:email])
          error!({ success: false, message: 'User suspended. Contact Administrator' }, 403) if existing_user.present? && existing_user.suspended?
          response = Subscriber.auth_by_rv(params, device)
          user = response[:user]
          if user.present?
            device.update(user_id: user.id)
            # TODO: Send email comfirmation and remove session expire from here
            generate_access_token_for_user(user, device.id, true)
            @access_token.update(is_rv_subscribed: true)
            if user.devices.count > 3
              logout_from_existing_session(user.access_tokens.order(:id).first)
            end
            responde_user_details(user, "Logged in successfully.", @access_token.token, false, params[:udid])
          else
            { success: false, message: response[:message] }
          end
        end

        desc "Logout user", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          use :authentication_params
        end
        post :logout do
          authenticate!
          logout_from_existing_session(@access_token)
          { success: true, message: "Signed out successfully" }
        end

        desc "Login with social customer", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash, desc: 'User details to login using social account' do
            requires :auth_uid, type: String, desc: "Auth UID"
            requires :auth_token, type: String, desc: "Auth Token"
            requires :provider, type: String, desc: "Provider [google]"
            requires :email, type: String, desc: "Email"
            optional :first_name, type: String, desc: "First Name"
            optional :last_name, type: String, desc: "Last Name"
            requires :udid, type: String, desc: "Unique Device ID"
          end
        end
        post :social_auth do
          error!({ success: false, message: 'This provider is not accepted' }, 400) unless Globalconstants::ALLOWED_PROVIDERS.include?(params[:user][:provider])
          device = Device.with_udid(params[:user][:udid]).first
          error!({ success: false, message: 'This device is not registered' }, 400) if device.blank?
          if params[:user][:provider] == 'google'
            validate_google_auth_token(params[:user][:auth_uid], params[:user][:auth_token])
          end
          user = Subscriber.auth_by_social_identity(params[:user])
          if user.present?
            generate_access_token_for_user(user, device.id)
            responde_user_details(user, "Logged in successfully", @access_token.token, false, params[:user][:udid])
          else
            error!({ success: false, message: error_message(user) }, 400)
          end
        end
      end
    end
  end
end
