module API::V1::Helpers::AuthenticationHelpers
  extend Grape::API::Helpers
  params :authentication_params do
    requires :user, type: Hash do
      requires :access_token, type: String, desc: "Access Token"
    end
  end
end
