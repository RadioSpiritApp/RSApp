class CreateCopyTexts < ActiveRecord::Migration[5.2]
  def change
    create_table :copy_texts do |t|
      t.string :page_name
      t.string :key
      t.text :value

      t.timestamps
    end
  end
end
