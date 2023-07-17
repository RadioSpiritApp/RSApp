module Globalconstants
  ACCESS_TOKEN_EXPIRY_IN_DAYS = 7300 # 20 years
  ALLOWED_PROVIDERS = ['google'].freeze
  RV_LOGIN_API = 'http://radiovault.com/appapi.asp'.freeze
  EMAIL_CONFIRMATION_EXPIRY_IN_DAYS = 2
  FREE_EPISODE_COUNT = 5

  def self.fetch_signed_url(url)
    signer = AwsCfSigner.new($secret[:cf_private_key])
    if url.present?
      url = url.gsub($secret[:s3_base_url], $secret[:cloudfront_url])
      signed_url = signer.sign(url, ending: 30.days.after)
    end
    signed_url
  end
end
