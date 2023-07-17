class AddDurationToAudios < ActiveRecord::Migration[5.2]
  def change
    add_column :audios, :duration, :integer
  end
end
