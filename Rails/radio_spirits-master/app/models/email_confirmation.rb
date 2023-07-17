class EmailConfirmation < ApplicationRecord
  belongs_to :user
  belongs_to :device

  scope :pending, ->{where(confirmed: false)}
end
