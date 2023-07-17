class CreateSubscriptionBucketPlans < ActiveRecord::Migration[5.2]
  def change
    create_table :subscription_bucket_plans do |t|
      t.references :subscription_bucket, foreign_key: true
      t.references :plan, foreign_key: true

      t.timestamps
    end
  end
end
