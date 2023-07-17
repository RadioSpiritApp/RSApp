class GenreSeries < ApplicationRecord
  belongs_to :genre
  belongs_to :series
end
