class AddColumnsForProductIdToPlans < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :itunes_id, :string
    add_column :plans, :play_store_id, :string
  end
end
