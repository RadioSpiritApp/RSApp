json.success @success
json.message @message
if @success
 json.page_details do
    if @continue_listening.present?
      json.continue_listening @continue_listening do |element|
        json.id element.id
        json.title element.title
        json.artwork_url element.artwork_url
        json.series_title element.series_title
        json.play_date element.play_date
        json.last_played_by_user element.bookmarks.last&.created_at.strftime('%s%L').to_i
        json.original_air_date element.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : element.original_air_date
      end
    end
    json.when_radio_was @when_radio_was unless @when_radio_was.blank?

    if @recently_added.present?
      json.recently_added @recently_added do |element|
        json.id element.id
        json.title element.title
        json.artwork_url element.artwork_url
        json.series_title element.series_title
        json.play_date element.play_date
        json.original_air_date element.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : element.original_air_date
      end
    end

    if @more_of_elements.present?
      json.more_of @more_of_elements do |more_of_element|
        json.object_type more_of_element.class.name
        json.id more_of_element.id
        json.title more_of_element.title
        json.artwork_url more_of_element.artwork_url
        if more_of_element.class.name == "Series"
          json.description more_of_element.description
        end
      end
    end

    if @featured_elements.present?
      json.featured @featured_elements do |featured_element|
        json.object_type featured_element.class.name
        json.id featured_element.id
        json.title featured_element.title
        json.artwork_url featured_element.artwork_url
        json.description featured_element.description
        if featured_element.class.name == "Episode"
          json.play_date featured_element.play_date
          json.original_air_date featured_element.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : featured_element.original_air_date
          json.series_title featured_element.series_title
        end
      end
    end

    if @popular_elements.present?
      json.popular @popular_elements do |popular_element|
        json.object_type popular_element.class.name
        json.id popular_element.id
        json.title popular_element.title
        json.artwork_url popular_element.artwork_url
        json.description popular_element.description
        if popular_element.class.name == "Episode"
          json.play_date popular_element.play_date
          json.original_air_date popular_element.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : popular_element.original_air_date
          json.series_title popular_element.series_title
        end
      end
    end
  end
end
