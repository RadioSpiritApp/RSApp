# frozen_string_literal: true

class Subscriber < User
  def authenticated?(udid)
    devices.pluck(:udid).include?(udid)
  end

  def confirmed_on?(udid)
    email_confirmations.joins(:device).where(confirmed: true).pluck(:udid).include?(udid)
  end

  # Class Methods
  class << self
    def authenticate(email, udid)
      user = find_by_email(email)
      user&.authenticated?(udid) ? user : (user&.confirmed_on?(udid) ? user : nil)
    end

    def auth_by_social_identity(params)
      is_success = true
      identity = Identity.find_for_oauth(params[:provider], params[:auth_uid])
      if identity.user.blank? && params[:email].present?
        user = User.with_email(params[:email]).first
      elsif identity.user.present?
        user = identity.user
        user.update_attributes(email: params[:email]) if user.email.blank? && params[:email].present?
      end
      if user.blank?
        begin
          ActiveRecord::Base.transaction do
            user = User.new(
              email: params[:email],
              first_name: params[:first_name],
              last_name: params[:last_name],
              skip_password_validation: true
            )
            user.role = User::SUBSCRIBER
            identity.update_attributes(user_id: user.id) if user.save!
          end
        rescue Exception => exception
          is_success = false
        end
      end
      is_success ? user : nil
    end

    def auth_by_rv(params, device)
      response = { user: nil, message: nil }
      api_data = {
        email: params[:email],
        password: params[:password],
        token: $secret[:rv_login_token]
      }
      res = HTTParty.post(Globalconstants::RV_LOGIN_API, body: api_data)
      parsed_data = JSON.parse(res.body)
      if parsed_data['authorized'] == '1'
        if Date.strptime(parsed_data['authenddate'], '%m/%d/%Y') > Date.today
          user = find_or_initialize_by(email: params[:email])
          if user.new_record?
            user.role = User::SUBSCRIBER
            user.skip_password_validation = true
            if user.save
              subscription = user.subscriptions.build(expiry_date: Date.strptime(parsed_data['authenddate'], '%m/%d/%Y'), type: Subscription::RV, platform: device.device_type)
              subscription.save
            end
          else
            unless user.subscriptions.where(expiry_date: Date.strptime(parsed_data['authenddate'], '%m/%d/%Y'), type: Subscription::RV).exists?
              subscription = user.subscriptions.build(expiry_date: Date.strptime(parsed_data['authenddate'], '%m/%d/%Y'), type: Subscription::RV, platform: device.device_type)
              subscription.save
            end
          end
        end
        response = { user: user, message: nil } if user.save
      else
        response = { user: nil, message: parsed_data['message'] }
      end
      response
    end
  end
end
