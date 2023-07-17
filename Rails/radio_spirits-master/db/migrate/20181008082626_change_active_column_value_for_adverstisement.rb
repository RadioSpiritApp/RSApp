class ChangeActiveColumnValueForAdverstisement < ActiveRecord::Migration[5.2]
  def up
    change_column_default :advertisements, :active, true
  end

  def down
    change_column_default :advertisements, :active, nil
  end
end
