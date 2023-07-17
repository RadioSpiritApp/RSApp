class CreatePlays < ActiveRecord::Migration[5.2]
  def change
    create_table :plays do |t|
    	t.integer :user_id
    	t.integer :device_id
    	t.integer :episode_id
    	t.string :rscuepisode_id
    	t.datetime :play_time
    	t.boolean :downloaded
      t.timestamps
    end
  end
end
