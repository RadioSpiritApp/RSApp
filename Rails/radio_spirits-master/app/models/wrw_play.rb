class WrwPlay < ApplicationRecord
	belongs_to :user, optional: true
	belongs_to :device
	belongs_to :episode
end
