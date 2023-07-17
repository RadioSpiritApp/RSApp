class AddColumnPlayedAtToRecentStream < ActiveRecord::Migration[5.2]
  def change
  	add_column :recent_streams, :played_at, :datetime
  end
end
