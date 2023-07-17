module API
  module V1
    class Genres < API::V1::Base
      include API::V1::Defaults

      resource :genres do
        helpers do
          def genre_serialize_data(genres)
            ActiveModelSerializers::SerializableResource.new(genres,
              each_serializer: GenreSerializer,
            ).serializable_hash
          end
        end

        desc "Genres listing", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        get do
          genres = Genre.with_series.available
          if genres.present?
            { success: true, message: I18n.t('genre_api.genre_list'), genres: genre_serialize_data(genres) }
          else
            { success: false, message: I18n.t('genre_api.no_genre') }
          end
        end
      end
    end
  end
end
