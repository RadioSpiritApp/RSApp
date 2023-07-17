class AddIsRvSubscribedToAccessToken < ActiveRecord::Migration[5.2]
  def change
    add_column :access_tokens, :is_rv_subscribed, :boolean, default: false
  end
end
