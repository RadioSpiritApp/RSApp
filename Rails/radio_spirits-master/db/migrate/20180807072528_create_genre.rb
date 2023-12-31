class CreateGenre < ActiveRecord::Migration[5.2]
  def change
    create_table :genres do |t|
      t.string :title
      t.boolean :available, default: true

      t.timestamps
    end
  end
end
