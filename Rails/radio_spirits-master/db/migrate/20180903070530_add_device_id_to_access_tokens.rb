class AddDeviceIdToAccessTokens < ActiveRecord::Migration[5.2]
  def change
    add_reference :access_tokens, :device, foreign_key: true
  end
end
