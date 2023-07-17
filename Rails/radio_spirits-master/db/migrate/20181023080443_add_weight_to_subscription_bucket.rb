class AddWeightToSubscriptionBucket < ActiveRecord::Migration[5.2]
  def change
  	add_column :subscription_buckets, :weight, :integer, null: false, default: 1
  end
end
