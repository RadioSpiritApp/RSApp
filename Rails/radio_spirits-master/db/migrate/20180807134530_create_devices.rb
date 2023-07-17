class CreateDevices < ActiveRecord::Migration[5.2]
  def change
    create_table :devices do |t|
      t.string :udid
      t.string :device_name
      t.string :fcm_token
      t.string :device_type
      t.string :device_locale
      t.string :timezone
      t.integer :onboarding_bucket_id
      t.integer :user_id

      t.timestamps
    end
  end
end