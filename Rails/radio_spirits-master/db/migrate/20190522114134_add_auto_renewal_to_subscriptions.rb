class AddAutoRenewalToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :auto_renewal, :boolean
  end
end
