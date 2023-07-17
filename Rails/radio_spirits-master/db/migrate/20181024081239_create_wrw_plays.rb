class CreateWrwPlays < ActiveRecord::Migration[5.2]
  def change
    create_table :wrw_plays do |t|
      t.integer :user_id
    	t.integer :device_id
    	t.integer :episode_id
    	t.datetime :play_time
    	t.boolean :downloaded
    	t.boolean :active_paid_user
      t.timestamps
    end
  end
end
