module API
  module V1
    class ConfigurableTexts < API::V1::Base
      include API::V1::Defaults



      resource :configurable_texts do
        desc "Get configurable text for pages", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        get jbuilder: "configurable_texts/page_details.json.jbuilder" do
          @copy_texts = CopyText.all.group_by{|copy_text| copy_text.page_name}
          @download_limit = Setting.find_by_name(Setting::DOWNLOAD_LIMIT).value
        end
      end
    end
  end
end
