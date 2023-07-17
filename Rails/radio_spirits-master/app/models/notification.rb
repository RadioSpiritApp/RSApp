class Notification < ApplicationRecord

  # Scopes
  scope :unread, ->{where(read: false)}
end
