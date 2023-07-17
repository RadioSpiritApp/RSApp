module Admin::SubscriptionBucketHelper
  def susbcription_bucket_state(bucket)
    if bucket.active && SubscriptionBucket.active.count == 1
      'disabled'
    else
      ''
    end
  end
end