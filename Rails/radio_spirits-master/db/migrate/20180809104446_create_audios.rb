class CreateAudios < ActiveRecord::Migration[5.2]
  def change
    create_table :audios do |t|
      t.string :attachment
      t.references :audible, polymorphic: true, index: true
      t.timestamps
    end
  end
end
