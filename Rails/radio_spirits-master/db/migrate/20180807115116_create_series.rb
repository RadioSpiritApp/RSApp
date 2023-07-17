class CreateSeries < ActiveRecord::Migration[5.2]
  def change
    create_table :series do |t|
      t.string :title
      t.text :description
      t.boolean :available, default: true
      t.boolean :featured, defalut: false

      t.timestamps
    end
  end
end
