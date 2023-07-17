class CreateBookmarks < ActiveRecord::Migration[5.2]
  def change
    create_table :bookmarks do |t|
      t.float :seek_time
      t.references :episode, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
