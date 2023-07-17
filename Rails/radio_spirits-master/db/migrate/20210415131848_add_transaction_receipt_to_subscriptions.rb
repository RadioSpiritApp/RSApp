class AddTransactionReceiptToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :transaction_receipt, :text
  end
end
