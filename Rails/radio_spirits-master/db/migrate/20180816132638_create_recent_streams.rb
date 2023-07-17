class CreateRecentStreams < ActiveRecord::Migration[5.2]
  def change
    create_table :recent_streams do |t|
      t.references :episode
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
