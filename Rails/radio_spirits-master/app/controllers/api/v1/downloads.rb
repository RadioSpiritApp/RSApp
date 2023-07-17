module API
  module V1
    class Downloads < API::V1::Base
      include API::V1::Defaults

      resource :downloads do
        desc "Create Downloads", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :udid, type: String, desc: "Unique Device Id"
          requires :episode_id, type: Integer, desc: "ID of Episode which needs to be downloaded"
          requires :access_token, type: String, desc: "User Access Token"
        end
        post do
          device = Device.with_udid(params[:udid]).first
          error!({ success: false, message: 'This device is not registered' }, 400) if device.blank?
          episode = Episode.find(params[:episode_id]) rescue nil
          error!({ success: false, message: 'Episode with this ID does not exist' }, 400) if episode.blank?
          if authenticate!
            if @current_user.has_active_subscription_on?(@current_device.device_type, @access_token)
              if (@current_user.downloads.count < Setting.download_limit)
                download = @current_user.downloads.build(episode_id: params[:episode_id]) unless @current_user.downloads.pluck(:episode_id).include?(episode.id)
                download.save if download.present?
                { success: true, message: 'Download created successfully' }
              else
                { success: false, message: 'Download limit exceed. Delete few downloads.' }
              end
            else
              { success: false, message: "Please subscribe to download episode." }
            end
          end
        end

        desc "Fetch downloads of a user", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :udid, type: String, desc: "Unique Device Id"
          requires :access_token, type: String, desc: "User Access Token"
        end
        get do
          device = Device.with_udid(params[:udid]).first
          error!({ success: false, message: 'This device is not registered' }, 400) if device.blank?
          if authenticate!
            @current_user.downloads
          end
        end
      end
    end
  end
end
