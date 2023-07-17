module API
  module V1
    module Helpers
      module SettingHelper
        extend Grape::API::Helpers

        def show_recently_added_section
          setting = get_setting('recently added section')
          setting.present? && setting.value.to_boolean
        end

        def show_when_radio_was_section
          setting = get_setting('when radio was section')
          setting.present? && setting.value.to_boolean
        end

        def show_popular_section
          setting = get_setting('popular section')
          setting.present? && setting.value.to_boolean
        end

        def show_featured_section
          setting = get_setting('featured section')
          setting.present? && setting.value.to_boolean
        end

        def show_more_of_section
          setting = get_setting('more of section')
          setting.present? && setting.value.to_boolean
        end

        def show_continue_listenig_section
          setting = get_setting('continue listening')
          setting.present? && setting.value.to_boolean
        end

        def get_setting(name)
          Setting.find_by_name(name)
        end
      end
    end
  end
end
