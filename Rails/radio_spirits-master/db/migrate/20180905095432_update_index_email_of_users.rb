class UpdateIndexEmailOfUsers < ActiveRecord::Migration[5.2]
  def change
    remove_index :users, :email
    add_index :users, [:email], unique: true, where: "email != NULL"
  end
end
