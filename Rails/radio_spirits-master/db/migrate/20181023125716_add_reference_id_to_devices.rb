class AddReferenceIdToDevices < ActiveRecord::Migration[5.2]
  def change
    add_column :devices, :reference_id, :string
  end
end
