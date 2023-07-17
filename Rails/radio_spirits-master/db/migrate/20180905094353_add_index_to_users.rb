class AddIndexToUsers < ActiveRecord::Migration[5.2]
  def change
    add_index :users, :transaction_identifier
  end
end
