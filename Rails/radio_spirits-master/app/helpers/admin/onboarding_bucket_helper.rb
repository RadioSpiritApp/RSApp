module Admin::OnboardingBucketHelper
  def onboarding_bucket_state(bucket)
    if bucket.active && OnboardingBucket.active.count == 1
      'disabled'
    else
      ''
    end
  end
end