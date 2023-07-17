class SubscriptionBucketPlan < ApplicationRecord
  belongs_to :subscription_bucket
  belongs_to :plan
end
