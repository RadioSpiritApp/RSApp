class AddTransactionIdentifierToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :transaction_identifier, :string
    add_column :subscriptions, :transaction_date, :datetime
  end
end
