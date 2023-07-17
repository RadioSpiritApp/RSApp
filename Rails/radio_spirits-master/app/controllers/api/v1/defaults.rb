module API
  module V1
    module Defaults
      extend ActiveSupport::Concern

      included do
        format :json

        helpers do
          def authenticate!
            begin
              decoded_token = JWT.decode params[:user][:access_token], $secret[:api_hmac_secret], true, { :algorithm => 'HS256' }
              @access_token = AccessToken.where(token: params[:user][:access_token]).first
              if @access_token.present?
                @current_user = @access_token.user
                @current_device = @access_token.device
              else
                error!({ success: false, message: 'Expired token.' }, 401)
              end
            rescue JWT::ExpiredSignature
              access_token = AccessToken.where(token: params[:user][:access_token]).first
              access_token.destroy if access_token.present?
              error!({ success: false, message: 'Expired token.' }, 401)
            rescue
              error!({ success: false, message: 'Invalid access token' }, 401)
            end
          end

          def authenticate_admin!
            @current_user = User.find_by(email: params[:user][:email].downcase)
            unless @current_user.present? && @current_user.valid_password?(params[:user][:password])
              error!({ success: false, message: 'Invalid admin credentials.' }, 401)
            end
          end

          def error_message(object)
            object.errors.full_messages.uniq.join(",")
          end
        end
      end
    end
  end
end
