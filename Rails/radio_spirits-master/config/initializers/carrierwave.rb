require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  config.asset_host = $secret[:cloudfront_url]
  config.storage = :fog
  config.fog_provider = 'fog/aws'
  config.fog_credentials = {
    :provider              => 'AWS',
    :aws_access_key_id     => $secret[:aws_access_key_id],
    :aws_secret_access_key => $secret[:aws_secret_access_key],
    :region                => 'us-east-1'
  }
  config.fog_directory    = $secret[:aws_bucket_name]
  config.fog_public       = false
end
