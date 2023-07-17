class AddRvSeriesIdToSeries < ActiveRecord::Migration[5.2]
  def change
    add_column :series, :rv_series_id, :integer
  end
end
