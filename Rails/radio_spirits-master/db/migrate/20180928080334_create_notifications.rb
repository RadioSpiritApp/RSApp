class CreateNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.string :notification_type
      t.string :message
      t.boolean :read, default: false
      t.string :attachment

      t.timestamps
    end
  end
end
