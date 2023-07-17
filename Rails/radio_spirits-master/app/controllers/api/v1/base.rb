module API
  module V1
    class Base < API::Base

      # helpers
      helpers API::V1::Helpers::AuthenticationHelpers
      # This method is allow access to the appication header contains the valid app secrets and id
      before do
        Rails.logger.debug("===========#{params.inspect}===========")
        unless skip_authorization
          error!({ success: false, message: 'Invalid authorization key' }, 401) unless authorized
        end
        status 200
      end

      helpers do
        def authorized
          # cmFkaW9fc3Bpcml0czpIREZrZlJhZGlvU3Bpcml0czY0NQ==
          authorization_key = Base64.strict_decode64(request.headers['Authorization']) rescue false
          authorization_key == "#{$secret[:api_client_id]}:#{$secret[:api_client_secret]}"
        end

        def skip_authorization
          # request&.env['HTTP_HOST'].include?('ngrok') && request&.env['REQUEST_URI'].include?('callback')
          request&.env['REQUEST_URI'].include?('callback')
        end
      end

      version 'v1', using: :header, vendor: 'users'

      mount API::V1::Users
      mount API::V1::Genres
      mount API::V1::Devices
      mount API::V1::Serieses
      mount API::V1::Episodes
      mount API::V1::Pages
      mount API::V1::Advertisements
      mount API::V1::SubscriptionPlans
      mount API::V1::Subscriptions
      mount API::V1::ConfigurableTexts
    end
  end
end
