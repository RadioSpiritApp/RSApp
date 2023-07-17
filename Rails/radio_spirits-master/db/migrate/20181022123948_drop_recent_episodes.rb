class DropRecentEpisodes < ActiveRecord::Migration[5.2]
  def change
  	drop_table :recent_episodes
  end
end
