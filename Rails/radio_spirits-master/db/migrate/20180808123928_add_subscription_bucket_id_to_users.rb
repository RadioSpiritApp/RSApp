class AddSubscriptionBucketIdToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :subscription_bucket_id, :integer
  end
end
