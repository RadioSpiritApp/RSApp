class AddFeaturedAtToSeries < ActiveRecord::Migration[5.2]
  def change
    add_column :series, :featured_at, :datetime
  end
end
