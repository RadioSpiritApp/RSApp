class AddDurationToAdvertisements < ActiveRecord::Migration[5.2]
  def change
    add_column :advertisements, :duration, :float
  end
end
