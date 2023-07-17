class Admin::SeriesController < Admin::BaseController

  before_action :set_series, only: [:edit, :update, :destroy, :activate_deactivate]

  def index
    @series =
      if params[:search_query].present?
        Series.search(params[:search_query])
      else
        Series.all
      end
    @series = @series.order("updated_at DESC").paginate(page: params[:page], per_page: 20)
  end

  def new
    @series = Series.new
    @series.genre_series.build
    @series.build_image
  end

  def create
    @series = Series.new(series_params)
    assign_image_attributes
    if @series.save
      redirect_to admin_series_index_path, notice: I18n.t('series.series_message', message: 'created')
    else
      render :new
    end
  end

  def edit
  end

  def update
    assign_image_attributes
    if @series.update(series_params)
      if @series.available? && @series.episodes.exists?
        @series.episodes.update_all(available: true)
      elsif !@series.available? && @series.episodes.exists?
        @series.episodes.update_all(available: false)
      end
      redirect_to admin_series_index_path, notice: I18n.t('series.series_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @series.destroy
      redirect_to admin_series_index_path, notice: I18n.t('series.series_message', message: 'destroyed')
    else
      redirect_to admin_series_index_path, notice: I18n.t('series.not_destroy')
    end
  end

  def activate_deactivate
    @series.toggle(:available)
    @series.save
    if @series.available? && @series.episodes.exists?
      @series.episodes.update_all(available: true)
    elsif !@series.available? && @series.episodes.exists?
      @series.episodes.update_all(available: false)
    end
    redirect_to admin_series_index_path
  end

  def downlaod_sample_csv
    respond_to do |format|
      format.csv { send_file Rails.root.join('db', 'seed_data', 'sample-series-upload.xlsx')}
    end
  end

  def upload_csv
    extension_name = File.extname(params[:file][:selected_file].original_filename)
    series_file_path = Rails.root.join("public", "#{Time.current.to_i}_temp_series#{extension_name}").to_path
    temp_file = IO.copy_stream(params[:file][:selected_file].tempfile.open, series_file_path)
    SeriesCsvImportWorker.perform_async(series_file_path)
    flash[:success] = "Series Import process is working in background."
    redirect_to admin_series_index_path
  end

  def destroy_all
    Series.destroy_all
    ActiveRecord::Base.connection.execute("TRUNCATE series RESTART IDENTITY CASCADE")
    ActiveRecord::Base.connection.execute("TRUNCATE episodes RESTART IDENTITY CASCADE")
    flash[:success] = "Series are successfully destroyed."
    redirect_to admin_series_index_path
  end

  private
    def set_series
      @series = Series.find_by_id(params[:series_id] || params[:id])
      return true if @series.present?
      flash[:alert] = "Series not found."
      redirect_to admin_series_index_path
    end

    def series_params
      params.require(:series).permit(:title, :description, :available, :featured, :featured_at, genre_ids: [])
    end

    def assign_image_attributes
      if params[:series][:image_attributes].present? && params[:series][:image_attributes]["attachment"].present?
        image_file_name = params[:series][:image_attributes]["attachment"].original_filename
        image = Image.where("attachment LIKE ?", "#{image_file_name}").first
        image.attachment = params[:series][:image_attributes]["attachment"] if image.present?
        image = Image.new(attachment: params[:series][:image_attributes]["attachment"]) if image.nil?
        @series.image_id = image.id if image.save
      end
    end
end
