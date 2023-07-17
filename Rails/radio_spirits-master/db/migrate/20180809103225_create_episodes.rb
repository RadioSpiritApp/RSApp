class CreateEpisodes < ActiveRecord::Migration[5.2]
  def change
    create_table :episodes do |t|
      t.boolean :paid, default: false
      t.string :title
      t.text :description
      t.boolean :available, default: true
      t.integer :stream_count, default: 0
      t.boolean :featured, default: false
      t.float :duration
      t.datetime :play_date
      t.datetime :original_air_date
      t.references :series, foreign_key: true, index: true

      t.timestamps
    end
  end
end
