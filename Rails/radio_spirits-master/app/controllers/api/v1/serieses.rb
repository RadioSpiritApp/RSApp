module API
  module V1
    class Serieses < API::V1::Base
      include API::V1::Defaults

      resource :series do
        helpers do
          def series_serialize_data(series)
            ActiveModelSerializers::SerializableResource.new(series,
              each_serializer: SeriesSerializer,
            ).serializable_hash
          end

          def page_number(params)
            params[:series].present? && params[:series][:page].present? ? params[:series][:page] : 1
          end

          def per_page(params)
            params[:series].present? && params[:series][:per_page].present? ? params[:series][:per_page] : 50
          end
        end

        desc "Series listing", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :series, type: Hash, desc: 'Series object' do
            optional :genre_id, type: String, desc: "Genre id"
            optional :page, type: Integer, except_values: [0]
            optional :per_page, type: Integer, except_values: [0]
          end
        end
        get do
          if params[:series].present? && params[:series][:genre_id].present?
            # series = Series.with_episodes.with_genre_id(params[:series][:genre_id]).available
            series = Series.includes(:genres).with_episodes.with_genre_id(params[:series][:genre_id]).available
                           .paginate(page: page_number(params), per_page: per_page(params))
          else
            # series = Series.with_episodes.available.paginate(page: page_number(params), per_page: per_page(params))
            series = Series.includes(:genres).with_episodes.available.paginate(page: page_number(params), per_page: per_page(params))
          end
          if series.present?
            { success: true, message: I18n.t('series_api.series_list'), series: series_serialize_data(series), total_pages: series.total_pages}
          else
            { success: false, message: I18n.t('series_api.no_series')}
          end
        end

        desc "Featured Series", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          optional :series, type: Hash, desc: 'Series object' do
            optional :page, type: Integer, except_values: [0]
          end
        end
        get :featured do
          series = Series.with_episodes.featured.available.order_by_featured.paginate(page: params[:series].present? && params[:series][:page].present? ? params[:series][:page] : 1 , per_page: 50)
          if series.present?
            { success: true, message: I18n.t('series_api.series_list'), series: series_serialize_data(series), total_pages: series.total_pages}
          else
            { success: false, message: I18n.t('series_api.no_series')}
          end
        end

        desc 'Search Series', {
          headers: {
            'Authorization' => {
              description: 'Authorization key',
              required: true
            }
          }
        }
        params do
          requires :series, type: Hash, desc: 'Series object' do
            requires :search_string, type: String, desc: 'Search String'
            optional :page, type: Integer, except_values: [0]
          end
        end
        get :search_series do
          series = Series.with_episodes.search(params[:series][:search_string]).available
                         .paginate(page: params[:series][:page], per_page: 50)
          if series.present?
            { success: true, message: I18n.t('series_api.series_list'), series: series_serialize_data(series), total_pages: series.total_pages}
          else
            { success: false, message: I18n.t('series_api.no_series')}
          end
        end
      end
    end
  end
end
