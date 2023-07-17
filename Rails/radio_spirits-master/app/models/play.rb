class Play < ApplicationRecord
	belongs_to :user
	belongs_to :device
	belongs_to :episode
end
