json.success @success
json.message @message
json.when_radio_was @episodes unless @episodes.blank?
json.total_pages @episode_play_dates.total_pages unless @episode_play_dates.blank?