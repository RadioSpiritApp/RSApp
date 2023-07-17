Raven.configure do |config|
  config.dsn = $secret[:sentry_dsn]
  config.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
end
