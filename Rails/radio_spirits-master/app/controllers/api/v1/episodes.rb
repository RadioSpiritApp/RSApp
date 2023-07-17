
module API
  module V1
    class Episodes < API::V1::Base
      include API::V1::Defaults
      require 'will_paginate/array'

      resource :episodes do
        helpers do
          def episode_serialize_data(episode, device_udid = nil, include_bookmark = nil)
            ActiveModelSerializers::SerializableResource.new(episode,
              each_serializer: EpisodeSerializer,
              scope: { current_user: @current_user, device_udid: device_udid, include_bookmark: include_bookmark, current_device: @current_device }
            ).serializable_hash
          end
        end

        desc "Episode listing", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :episode, type: Hash, desc: 'Episode object' do
            optional :series_id, type: String, desc: "Series id"
            optional :page, type: Integer, except_values: [0]
          end
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
        end
        get do
          authenticate! if params[:user].present? && params[:user][:access_token].present?
          page = params[:episode].present? && params[:episode][:page].present? ? params[:episode][:page] : 1
          episodes =
            if params[:episode].present? && params[:episode][:series_id].present?
              Episode.includes(:image, :audio, series: :image).with_series_id(params[:episode][:series_id]).paid.listing.with_audio_episodes.order_by_series_title_and_air_date.paginate(page: page, per_page: 50)
            else
              Episode.includes(:image, :audio, series: :image).paid.listing.with_audio_episodes.order_by_series_title_and_air_date.paginate(page: page, per_page: 50)
            end
          if episodes.present?
            { success: true, message: I18n.t('episodes_api.episodes_list'), episodes: episode_serialize_data(episodes), total_pages: episodes.total_pages}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end

        desc "When radio was listing", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :episode, type: Hash, desc: 'Episode object' do
            optional :page, type: Integer, except_values: [0]
          end
        end
        get :when_radio_was, jbuilder: 'episodes/when_radio_was.json.jbuilder' do
          page = params[:episode].present? && params[:episode][:page].present? ? params[:episode][:page] : 1
          @episode_play_dates = Episode.where('DATE(play_date) <= ? AND paid = ? AND available = ? AND audio_id IS NOT NULL', Date.today, false, true)
                                       .order('play_date desc').pluck(:play_date).uniq.paginate(page: page, per_page: 50)
          @episodes = Episode.when_radio_was(@episode_play_dates)
          if @episodes.present?
            @success = true
            @message = I18n.t('episodes_api.episodes_list')
          else
            @success = false
            @message = I18n.t('episodes_api.no_episodes')
          end
        end

        desc "Featured Episodes", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :episode, type: Hash, desc: 'Episode object' do
            optional :page, type: Integer, except_values: [0]
          end
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
        end
        get :featured do
          authenticate! if params[:user].present? && params[:user][:access_token].present?
          episodes = Episode.paid.featured.listing.with_audio_episodes.order_by_featured.paginate(page: params[:episode].present? && params[:episode][:page].present? ? params[:episode][:page] : 1 , per_page: 50)
          if episodes.present?
            { success: true, message: I18n.t('episodes_api.episodes_list'), episodes: episode_serialize_data(episodes), total_pages: episodes.total_pages}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end

        desc "Play Episode", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :device_udid, type: String, desc: 'Device Unique Id'
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
          requires :episode, type: Hash, desc: 'Episode object' do
            requires :id, type: String, desc: 'Episode ID'
          end
          requires :include_bookmark, default: "false",  type: Boolean,  desc: 'Set bookmark value'
        end
        get :play_episode do
          authenticate! if params[:user].present? && params[:user][:access_token].present?
          episode = Episode.find_by_id(params[:episode][:id])
          error!({ success: false, message: 'Episode not found' }, 400) if episode.blank? || !episode.available
          device = Device.find_by_udid(params[:device_udid])
          error!({ success: false, message: 'Device not found' }, 400) if device.blank?
          if @current_user&.has_active_subscription_on?(@current_device&.device_type, @access_token) && episode.paid?
            @play = @current_user.plays.build(episode_id: episode.id, device_id: @current_device.id, rscuepisode_id: episode&.rscuepisode_id, play_time: Time.now(), downloaded: false)
            @play.save!
          elsif (!episode.paid?)
            @wrw_play = device.wrw_plays.build(episode_id: episode.id, device_id: device.id, play_time: Time.now(), downloaded: false, user_id: @current_user&.id, active_paid_user: @current_user&.has_active_subscription_on?(@current_device&.device_type, @access_token) || false)
            @wrw_play.save!
          end

          if @current_user&.has_active_subscription_on?(@current_device&.device_type, @access_token)
            @recent_stream = @current_user.recent_streams.find_or_create_by(episode_id: episode.id)
            if @recent_stream.update_attributes(played_at: Time.now())
              { success: true, message: I18n.t('episodes_api.episodes_list'), episode:  episode_serialize_data(episode, params[:device_udid], params[:include_bookmark])}
            else
              { success: false, message: I18n.t('episodes_api.no_episodes')}
            end
          else
            if episode.paid?
              { success: false, message: I18n.t('episodes_api.not_accessible')}
            else
              if Episode.free_playable_episode_ids.include?(episode.id)
                { success: true, message: I18n.t('episodes_api.episodes_list'), episode:  episode_serialize_data(episode, params[:device_udid], params[:include_bookmark])}
              else
                { success: false, message: I18n.t('episodes_api.not_accessible')}
              end
            end
          end
        end

        desc "Play all episodes", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :device_udid, type: String, desc: 'Device Unique Id'
          requires :user, type: Hash do
            requires :access_token, type: String, desc: "Token sends here"
          end
          requires :episode, type: Hash, desc: 'Episode object' do
            requires :series_id, type: String, desc: 'Series ID'
            optional :page, type: Integer, except_values: [0]
          end
        end
        get :play_all do
          authenticate!
          error!({ success: false, message: I18n.t('episodes_api.subscription_expire') }, 400) unless @current_user&.has_active_subscription_on?(@current_device&.device_type, @access_token)
          episodes = Episode.includes(:image, :audio, series: :image).paid.by_series(params[:episode][:series_id]).listing.with_audio_episodes.order_by_series_title_and_air_date.paginate(page: params[:episode].present? && params[:episode][:page].present? ? params[:episode][:page] : 1 , per_page: 50)
          error!({ success: false, message: 'Episode not found' }, 400) if episodes.blank?
          { success: true, message: I18n.t('episodes_api.episodes_list'), episode:  episode_serialize_data(episodes, params[:device_udid]), total_pages: episodes.total_pages}
        end

        desc "Search Episodes", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :episodes, type: Hash, desc: 'Episode object' do
            requires :search_string, type: String, desc: 'Episode String'
            optional :page, type: Integer, except_values: [0]
          end
          optional :sort_by, type: Symbol, values: [:episode_title, :series_title, :original_air_date], documentation: { default: 'original_air_date' }, desc: "Tags to filter by"
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
        end
        get :search_episodes do
          authenticate! if params[:user].present? && params[:user][:access_token].present?
          search_episodes = Episode.search(params[:episodes][:search_string])
          episodes = Episode.sort_by_order(params[:sort_by], search_episodes)
          if episodes.present?
            page = params[:episodes].present? && params[:episodes][:page].present? ? params[:episodes][:page] : 1
            episodes = episodes.paid.listing.with_audio_episodes.order_by_series_title_and_air_date
                               .includes(:series).paginate(page: page, per_page: 50)
            { success: true, message: I18n.t('episodes_api.episodes_list'), episodes: episode_serialize_data(episodes), total_pages: episodes.total_pages}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end

        desc "Increment stream count", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
          requires :episode_id, type: String, desc: 'Episode ID'
        end
        post :update_stream_count do
          episode = Episode.find_by_id(params[:episode_id])
          if episode && episode.increment!(:stream_count)
            { success: true, message: I18n.t('episodes_api.increment_stream_count')}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end

        desc "Bookmark the Episode", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
          requires :episode_id, type: String, desc: 'Episode ID'
          requires :seek_time, type: String, desc: 'ex 86 (seconds)'
        end
        post :bookmark do
          authenticate!
          if @current_user&.has_active_subscription_on?(@current_device&.device_type, @access_token)
            episode = Episode.find(params[:episode_id])
            @recent_stream = @current_user.recent_streams.find_or_create_by(episode_id: episode.id)
            @recent_stream.update_attributes(played_at: Time.zone.now() - params[:seek_time].to_f)
            if (episode.duration - params[:seek_time].to_f) < 60
              episode.bookmarks.where(user_id: @current_user.id).destroy_all
              { success: false, message: I18n.t('episodes_api.bookmark_time_exceed') }
            else
              bookmark = Bookmark.find_or_create_by(episode_id: params[:episode_id], user_id: @current_user.id) if (params[:seek_time].to_f > 5)
              if bookmark.present? && bookmark.update_attributes(seek_time: params[:seek_time].to_f)
                { success: true, message: I18n.t('episodes_api.episode_bookmark'), seek_time: bookmark.seek_time}
              else
                { success: false, message: I18n.t('episodes_api.episode_not_bookmarked') }
              end
            end
          else
            { success: false, message: I18n.t('episodes_api.not_accessible') }
          end
        end

        desc "Create new episode", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash do
            requires :email, type: String, desc: "Admin email"
            requires :password, type: String, desc: "Admin email"
          end
          requires :episode, type: Hash, desc: 'Episode object' do
            requires :title, type: String, desc: "Title"
            requires :description, type: String, desc: "Description"
            requires :paid, type: Boolean, desc: "Is Paid"
            requires :available, type: Boolean, desc: "Is Available"
            requires :featured, type: Boolean, desc: "Is Featured"
            requires :play_date, type: String, desc: "Release date Ex. 10/25/2018"
            requires :original_air_date, type: String, desc: "Original Air Date Ex. 10/25/2018"
            requires :series_id, type: Integer, desc: 'Series ID'
            requires :rscuepisode_id, type: Integer, desc: 'Rscuepisode_id'
            optional :image, :type => Rack::Multipart::UploadedFile, :desc => "Image"
            optional :audio, :type => Rack::Multipart::UploadedFile, :desc => "Audio"
            optional :duration, type: Float, :desc => "Episode Duration"

          end
        end
        post :create_episode, jbuilder: 'episodes/create_episode.json.jbuilder' do
          authenticate_admin!
          series = Series.find_by_id(params[:episode][:series_id])
          error!({ success: false, message: 'Series not found.' }, 400) if series.blank?
          play_date = Date.strptime(params[:episode][:play_date], '%m/%d/%Y') rescue nil
          error!({ success: false, message: 'Play date format is incorrect.' }, 400) if play_date.blank?
          original_air_date = Date.strptime(params[:episode][:original_air_date], '%m/%d/%Y') rescue nil
          error!({ success: false, message: 'Original air date format is incorrect.' }, 400) if original_air_date.blank?
          params[:episode][:play_date] = play_date
          params[:episode][:original_air_date] = original_air_date
          @episode = series.episodes.build(params[:episode].except(:series_id, :image, :audio))
          error!({ success: false, message: error_message(@episode)}, 400) unless @episode.save
          FileUtils::mkdir_p "public/episode_#{@episode.id}"
          if params[:episode][:image].present? && params[:episode][:image][:filename].present?
            image_file_path = File.join("public", "episode_#{@episode.id}", params[:episode][:image][:filename])
            image_file = params[:episode][:image][:tempfile]
            FileUtils.cp image_file, image_file_path
          end
          if params[:episode][:audio].present? && params[:episode][:audio][:filename].present?
            audio_file_path = File.join("public", "episode_#{@episode.id}", params[:episode][:audio][:filename])
            audio_file = params[:episode][:audio][:tempfile]
            FileUtils.cp audio_file, audio_file_path
          end
          EpisodeUploaderWorker.perform_async(@episode.id, audio_file_path, image_file_path)
        end

        desc "Search when radio was", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :episodes, type: Hash, desc: 'Episode object' do
            requires :search_string, type: String, desc: 'Episode String'
            optional :page, type: Integer, except_values: [0]
          end
        end
        get :search_when_radio_was, jbuilder: 'episodes/when_radio_was.json.jbuilder' do
          @episodes = Episode.search_when_radio_was(params[:episodes][:search_string])
          if @episodes.present?
            @success = true
            @message = I18n.t('episodes_api.episodes_list')
          else
            @success = false
            @message = I18n.t('episodes_api.no_episodes')
          end
        end

        desc "Get recently played episodes", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash do
            requires :access_token, type: String, desc: "Token sends here"
          end
          optional :page, type: Integer, except_values: [0]
        end
        get :recent_episodes do
          authenticate!
          episodes = Episode.joins(:recent_streams).listing.with_audio_episodes.where("recent_streams.user_id": @current_user.id).order("recent_streams.played_at desc").paginate(page:  params[:page] || 1 , per_page: 50)
          if episodes.present?
            free_episodes_hash = Episode.get_free_episodes_by_played_at(episodes.free)
            paid_episodes_hash = Episode.get_paid_episodes_by_played_at(@current_user, episodes.paid)
            result = free_episodes_hash.merge(paid_episodes_hash)
            @episodes = result.sort_by{|key| key}.reverse.to_h.values
            { success: true, message: I18n.t('episodes_api.episodes_list'), episodes: @episodes, total_pages: episodes.total_pages}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end


        desc "Continue listing episodes", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :user, type: Hash do
            optional :access_token, type: String, desc: "Token sends here"
          end
          optional :page, type: Integer, except_values: [0]
        end
        get :continue_listening_episodes do
          authenticate!
          episodes = @current_user.episodes_for_continue_listening
          if episodes.present?
            { success: true, message: I18n.t('episodes_api.episodes_list'), episodes: episode_serialize_data(episodes)}
          else
            { success: false, message: I18n.t('episodes_api.no_episodes')}
          end
        end


        desc "Download the episode", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash do
            requires :access_token, type: String, desc: "Token sends here"
          end
          requires :episode, type: Hash, desc: 'Episode object' do
            requires :id, type: String, desc: 'Episode ID'
          end
          requires :device_udid, type: String, desc: 'Device Unique Id'
        end
        get :download_episode do
          authenticate!
          episode = Episode.find_by_id(params[:episode][:id])
          error!({ success: false, message: 'Episode not found' }, 400) if episode.blank? || !episode.available
          device = Device.find_by_udid(params[:device_udid])
          error!({ success: false, message: 'Device not found' }, 400) if device.blank?
          error!({ success: false, message: 'Subscription Expired!' }, 400) if !@current_user.has_active_subscription_on?(@current_device&.device_type, @access_token)

          if episode.paid?
            @downloaded_episode = @current_user.plays.build(episode_id: episode.id, device_id: @current_device.id, rscuepisode_id: episode&.rscuepisode_id, play_time: Time.now(), downloaded: true)
          else
            @downloaded_episode = @current_device.wrw_plays.build(episode_id: episode.id, device_id: @current_device.id, play_time: Time.now(), downloaded: true, user_id: @current_user.id, active_paid_user: @current_user.has_active_subscription_on?(@current_device&.device_type, @access_token))
          end
          if @downloaded_episode.save
            { success: true, message: "Episode downloaded successfully", episode: episode_serialize_data(episode, params[:device_udid])}
          else
            { success: false, message: I18n.t('episodes_api.not_accessible')}
          end
        end
      end
    end
  end
end
