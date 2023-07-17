class AddTransactionIdentifierToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :transaction_identifier, :string
  end
end
