class CreateGenreSeries < ActiveRecord::Migration[5.2]
  def change
    create_table :genre_series do |t|
      t.references :genre, foreign_key: true, index: true
      t.references :series, foreign_key: true, index: true

      t.timestamps
    end
  end
end
