class AddColumnToSeries < ActiveRecord::Migration[5.2]
  def change
    add_column :series, :episodes_count, :integer, default: 0, null: false
  end
end
