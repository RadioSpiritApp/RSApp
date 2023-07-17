class Admin::GenresController < Admin::BaseController
  before_action :set_genre, only: [:show, :edit, :update, :destroy, :activate_deactivate]

  def index
    @genres =
      if params[:search_query].present?
        Genre.search(params[:search_query])
      else
        Genre.all
      end
    @genres = @genres.order_by_id.paginate(page: params[:page], per_page: 20)
  end

  def new
    @genre = Genre.new
    @genre.build_image
  end

  def edit
  end

  def create
    @genre = Genre.new(genre_params)
    assign_image_attributes
    if @genre.save
      redirect_to admin_genres_path, notice: I18n.t('genres.genre_message', message: 'created')
    else
      render :new
    end
  end

  def update
    assign_image_attributes
    if @genre.update(genre_params)
      redirect_to admin_genres_path, notice: I18n.t('genres.genre_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @genre.destroy
      redirect_to admin_genres_path, notice: I18n.t('genres.genre_message', message: 'destroyed')
    else
      redirect_to admin_genres_path, notice: I18n.t('genres.not_destroy')
    end
  end

  def activate_deactivate
    @genre.toggle(:available)
    @genre.save
    redirect_to admin_genres_path
  end

  private
    def set_genre
      @genre = Genre.find_by_id(params[:genre_id] || params[:id])
      return true if @genre.present?
      flash[:alert] = "Genre not found."
      redirect_to admin_genres_path
    end

    def genre_params
      params.require(:genre).permit(:title, :available)
    end

    def assign_image_attributes
      if params[:genre][:image_attributes].present? && params[:genre][:image_attributes]["attachment"].present?
        image_file_name = params[:genre][:image_attributes]["attachment"].original_filename
        image = Image.where("attachment LIKE ?", "#{image_file_name}").first
        image.attachment = params[:genre][:image_attributes]["attachment"] if image.present?
        image = Image.new(attachment: params[:genre][:image_attributes]["attachment"]) if image.nil?
        @genre.image_id = image.id if image.save
      end
    end
end
