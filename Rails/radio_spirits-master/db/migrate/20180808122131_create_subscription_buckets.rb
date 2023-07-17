class CreateSubscriptionBuckets < ActiveRecord::Migration[5.2]
  def change
    create_table :subscription_buckets do |t|
      t.string :title
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
