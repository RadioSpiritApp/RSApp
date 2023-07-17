class AddSusbscriptionBucketIdToDevices < ActiveRecord::Migration[5.2]
  def change
    add_column :devices, :subscription_bucket_id, :integer
  end
end
