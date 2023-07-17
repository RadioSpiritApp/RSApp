class ChangeDateFormatInEpisodes < ActiveRecord::Migration[5.2]
  def up
    change_column :episodes, :play_date, :date
  end

  def down
    change_column :episodes, :play_date, :datetime
  end
end
