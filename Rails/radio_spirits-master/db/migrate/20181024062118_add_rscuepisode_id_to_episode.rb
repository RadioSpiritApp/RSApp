class AddRscuepisodeIdToEpisode < ActiveRecord::Migration[5.2]
  def change
  	add_column :episodes, :rscuepisode_id, :string
  end
end
