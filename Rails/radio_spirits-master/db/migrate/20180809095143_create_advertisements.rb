class CreateAdvertisements < ActiveRecord::Migration[5.2]
  def change
    create_table :advertisements do |t|
      t.string :title
      t.string :ad_type
      t.string :redirect_url
      t.boolean :active

      t.timestamps
    end
  end
end
