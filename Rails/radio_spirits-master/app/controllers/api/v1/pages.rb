module API
  module V1
    class Pages < API::V1::Base
      include API::V1::Defaults
      helpers API::V1::Helpers::SettingHelper
      require 'will_paginate/array'

      resource :pages do
        desc 'Get Page details', {
          headers: {
            'Authorization' => {
              description: 'Authorization key',
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash, desc: 'User details to get homepage content' do
            requires :udid, type: String, desc: 'Unique Device Id'
            optional :access_token, type: String, desc: 'Access Token if subscribed user'
          end
        end
        get :homepage, jbuilder: 'pages/homepage.json.jbuilder' do
          begin
            device = Device.find_by(udid: params[:user][:udid])
            paid_user = false
            @recently_added = show_recently_added_section ? Episode.available.paid.with_audio_episodes.sort_by_play_date.order_by_play_date.first(10) : []
            episode_play_dates = Episode.where('DATE(play_date) <= ? AND paid = ? AND available = ? AND audio_id IS NOT NULL', Date.today, false, true).order('play_date desc').pluck(:play_date).uniq.first(15)
            @when_radio_was = show_when_radio_was_section ? Episode.when_radio_was(episode_play_dates) : []
            if show_featured_section
              featured_series = Series.with_episodes.featured.available.order_by_featured.first(Setting.featured_series_limit)
              featured_episodes = Episode.featured.available.paid.with_audio_episodes.order_by_featured.first(Setting.featured_episodes_limit)
              @featured_elements = (featured_series + featured_episodes).sort_by(&:featured_at).reverse!
            else
              @featured_elements = []
            end
            if show_popular_section
              popular_series = Series.most_popular
              popular_episodes = Episode.most_popular
              @popular_elements = (popular_series + popular_episodes)
            else
              @popular_elements = []
            end
            if device.present? && device.user.present? && params[:user][:access_token].present? && authenticate!
              paid_user = @current_user.has_active_subscription_on?(@current_device&.device_type, @access_token)
            end
            if paid_user && show_continue_listenig_section
              @continue_listening = @current_user.continue_listening_episodes_for_homepage.order_by_play_date.uniq.first(15)
            end
            if @current_user.present? && show_more_of_section
              more_of_series, more_of_genres = @current_user.get_more_of
              @more_of_elements = (more_of_series + more_of_genres)
            end

            @success = true
            @message = 'Home Page details fetched successfully.'
          rescue Exception => e
            @success = false
            @message = e.message
          end
        end
      end
    end
  end
end
