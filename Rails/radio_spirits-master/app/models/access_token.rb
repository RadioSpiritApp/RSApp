# frozen_string_literal: true

class AccessToken < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :device

  # Callbacks
  before_create :generate_token

  attr_accessor :expiry_date

  private
    def generate_token
      begin
        exp = if expiry_date.present? && expiry_date.is_a?(Date)
                expiry_date.end_of_day.to_i
              else
                Time.current.to_i + Globalconstants::ACCESS_TOKEN_EXPIRY_IN_DAYS.days.to_i
              end
        exp_payload = { :data => "radio_spirits_api_#{device_id}", :exp => exp }
        token = JWT.encode exp_payload, $secret[:api_hmac_secret], 'HS256'
        self.token = token
      end while self.class.exists?(token: token)
    end
end
