class UsersController < ApplicationController
  def confirm_email
    @success = false
    @message = ""
    email_confirmation = EmailConfirmation.where(confirmation_token: params[:token]).first
    if ((email_confirmation.nil?) || (email_confirmation.present? && email_confirmation.confirmed?))
      @message = (email_confirmation.nil?) ? "Invalid Token" : "Email already verified"
      return
    end
    begin
      decoded_token = JWT.decode params[:token], $secret[:api_hmac_secret], true, { :algorithm => 'HS256' }
      email_confirmation.update(confirmed: true)
      @success = true
      @message = "Your email has been confirmed successfully."
    rescue JWT::ExpiredSignature
      email_confirmation.user.send_email_confirmation(email_confirmation.device)
      email_confirmation.destroy
      @message = "Token Expired. We have sent a new link."
    rescue
      @message = 'Invalid token'
    end
  end
end
