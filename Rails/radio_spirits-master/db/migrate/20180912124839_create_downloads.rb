class CreateDownloads < ActiveRecord::Migration[5.2]
  def change
    create_table :downloads do |t|
      t.references :episode, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
