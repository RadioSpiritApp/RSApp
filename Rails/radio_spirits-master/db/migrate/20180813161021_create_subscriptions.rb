class CreateSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :subscriptions do |t|
      t.string :type
      t.references :plan, foreign_key: true
      t.references :user, foreign_key: true
      t.date :expiry_date

      t.timestamps
    end
  end
end
