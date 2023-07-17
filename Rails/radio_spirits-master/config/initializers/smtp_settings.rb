Rails.application.config.action_mailer.delivery_method = :smtp
Rails.application.config.action_mailer.smtp_settings = {
  :user_name      => $secret[:gmail_usename],
  :password       => $secret[:gmail_password],
  :port           => 587,
  :address        => 'smtp.gmail.com',
  :authentication => :plain,
  :enable_starttls_auto => true
}
