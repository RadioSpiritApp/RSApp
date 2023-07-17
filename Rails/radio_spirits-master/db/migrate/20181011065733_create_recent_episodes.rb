class CreateRecentEpisodes < ActiveRecord::Migration[5.2]
  def change
    create_table :recent_episodes do |t|
      t.references :episode
      t.references :user, foreign_key: true
      t.datetime :played_at
      t.timestamps
    end
  end
end
