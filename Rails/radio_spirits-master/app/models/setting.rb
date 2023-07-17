class Setting < ApplicationRecord

  HOME_PAGE_CONTENT = ["more of section", "featured section", "popular section", "when radio was section", "recently added section", "continue listening"]
  DOWNLOAD_LIMIT = "user download limit"

  # Scopes
  scope :featured_series_limit, -> {where(name: "featured series limit").first.value.to_i rescue 15}
  scope :featured_episodes_limit, -> {where(name: "featured episode limit").first.value.to_i rescue 15}
  scope :popular_series_limit, -> {where(name: "Popular Series Limit").first.value.to_i rescue 5}
  scope :popular_episodes_limit, -> {where(name: "Popular Episode Limit").first.value.to_i rescue 5}
  scope :more_of_series_limit, ->{where(name: "More Of Series Limit").first.value.to_i rescue 3}

  # Validations
  validates :name, presence: true, uniqueness: true
end
