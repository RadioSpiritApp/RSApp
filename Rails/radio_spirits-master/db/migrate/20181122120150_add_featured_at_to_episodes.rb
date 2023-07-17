class AddFeaturedAtToEpisodes < ActiveRecord::Migration[5.2]
  def change    
    add_column :episodes, :featured_at, :datetime    
  end
end
