class AddPlatformToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :platform, :string
  end
end
