module Admin::SeriesHelper
  def series_list
    Series.available.map{|series| [series.title, series.id]}
  end

  def get_genres_title_for(series)
    series.genres.pluck(:title).join(', ')
  end
end
