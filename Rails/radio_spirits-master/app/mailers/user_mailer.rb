class UserMailer < ApplicationMailer
  def email_confirmation(email, token)
    @email = email
    @token = token
    mail(:to => "#{email}", :subject => "Email Confirmation")
  end
end
