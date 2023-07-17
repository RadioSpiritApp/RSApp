class CreateEmailConfirmations < ActiveRecord::Migration[5.2]
  def change
    create_table :email_confirmations do |t|
      t.integer :device_id
      t.integer :user_id
      t.boolean :confirmed, default: false
      t.string :confirmation_token

      t.timestamps
    end
  end
end
