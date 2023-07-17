class CreatePlans < ActiveRecord::Migration[5.2]
  def change
    create_table :plans do |t|
      t.string :title
      t.integer :validity
      t.float :amount
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
