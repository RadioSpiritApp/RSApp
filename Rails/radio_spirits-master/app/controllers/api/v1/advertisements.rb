module API
  module V1
    class Advertisements < API::V1::Base
      include API::V1::Defaults

      resource :advertisements do
        desc "Banner Random Advertisement", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        get do
          @ad = Advertisement.active.image_list.random.first
          if @ad.present?
            { success: true, message: I18n.t('advertisements.ads_list'), ad: AdvertisementSerializer.new(@ad)}
          else
            { success: false, message: I18n.t('advertisements.no_ads ')}
          end
        end
      end
    end
  end
end
