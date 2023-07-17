class Admin::EpisodesController < Admin::BaseController

  require "mp3info"
  before_action :set_episode, only: [:edit, :update, :destroy, :activate_deactivate]
  before_action :set_date, only: [:create, :update]

  def index
    @episodes =
      if params[:search_query].present?
        Episode.search(params[:search_query])
      else
        Episode.all
      end
    @episodes = @episodes.order("updated_at DESC").paginate(page: params[:page], per_page: 20)
  end

  def new
    @episode = Episode.new
    @episode.build_image
    @episode.build_audio
  end

  def create
    @episode = Episode.new(episode_params)
    assign_media_attributes(params)
    if @episode.save
      Episode.free.where(title: @episode.title, play_date: @episode.play_date, series_id: @episode.series.id).where.not(id: @episode.id).update_all(audio_id:  @episode.audio_id) unless @episode.paid? && @episode.audio_id.nil?
      redirect_to admin_episodes_path, notice: I18n.t('episodes.episode_message', message: 'created')
    else
      render :new
    end
  end

  def edit
    unless @episode.series.available?
      flash[:alert] = "Can't edit episode. Parent Series is deactive"
      redirect_to admin_episodes_path
    end
  end

  def update
    assign_media_attributes(params)
    if @episode.update(episode_params)
      Episode.free.where(title: @episode.title, play_date: @episode.play_date, series_id: @episode.series.id).where.not(id: @episode.id).update_all(audio_id:  @episode.audio_id) unless @episode.paid? && @episode.audio_id.nil?
      redirect_to admin_episodes_path, notice: I18n.t('episodes.episode_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @episode.destroy
      redirect_to admin_episodes_path, notice: I18n.t('episodes.episode_message', message: 'destroyed')
    else
      redirect_to admin_episodes_path, notice: I18n.t('episodes.not_destroy')
    end
  end

  def activate_deactivate
    @episode.toggle(:available)
    @episode.save
    redirect_to admin_episodes_path
  end

  def downlaod_sample_csv
    respond_to do |format|
      format.csv { send_file Rails.root.join('db', 'seed_data', 'sample-episodes-upload.xlsx')}
    end
  end

  def upload_episodes_from_csv
    extension_name = File.extname(params[:selected_file].original_filename)
    episodes_file_path = Rails.root.join("public", "#{Time.current.to_i}_temp_episodes#{extension_name}").to_path
    temp_file = IO.copy_stream(params[:selected_file].tempfile.open, episodes_file_path)
    EpisodeCsvImportWorker.perform_async(episodes_file_path)
    flash[:success] = "Episodes Import process is working in background."
    redirect_to admin_episodes_path
  end

  def downlaod_error_file
    notification = Notification.find_by_id(params[:notification_id])
    if notification.present? && notification.attachment.present?
      respond_to do |format|
        format.xlsx do
          if notification.notification_type == "bulk_series_upload"
            send_file notification.attachment, filename: "series-error-file.xlsx", type: 'text/xlsx', disposition: 'attachment'
          else
            send_file notification.attachment, filename: "episode-error-file.xlsx", type: 'text/xlsx', disposition: 'attachment'
          end
        end
      end
    end
  end

  private
    def set_episode
      @episode = Episode.find_by_id(params[:episode_id] || params[:id])
      return true if @episode.present?
      flash[:alert] = "Episode not found."
      redirect_to admin_episodes_path
    end

    def episode_params
      if params[:begin_duration].present?
        begin_time_arr = params[:begin_duration].to_s.split(":")
        params[:begin_duration] = (begin_time_arr.first.to_i * 3600 + begin_time_arr.second.to_i * 60 + begin_time_arr.last.to_i) rescue nil
      end
      if params[:end_duration].present?
        end_time_arr = params[:end_duration].to_s.split(":")
        params[:end_duration] = (end_time_arr.first.to_i * 3600 + end_time_arr.second.to_i * 60 + end_time_arr.last.to_i) rescue nil
      end
      params.require(:episode).permit(:title, :description, :available, :featured,
        :paid, :stream_count, :play_date, :original_air_date, :series_id,
        :begin_duration, :end_duration, :rscuepisode_id, :featured_at)
    end

    def set_date
      params[:episode][:play_date] = Date.strptime(params[:episode][:play_date], "%m/%d/%Y")
      params[:episode][:original_air_date] = Date.strptime(params[:episode][:original_air_date], "%m/%d/%Y")
    end

    def assign_media_attributes(params)
      if params[:episode][:audio_attributes].present? && params[:episode][:audio_attributes]["attachment"].present?
        duration = nil
        audio_file_name = params[:episode][:audio_attributes]["attachment"].original_filename.gsub(/[ ()]/,'_').gsub(". ", ".").gsub(",", "_")
        audio = Audio.where("attachment LIKE ?", "#{audio_file_name}").first
        audio.attachment = params[:episode][:audio_attributes]["attachment"] if audio.present?
        audio = Audio.new(attachment: params[:episode][:audio_attributes]["attachment"]) if audio.nil?
        Mp3Info.open(params[:episode][:audio_attributes]["attachment"].tempfile) do |mp3info|
          duration = mp3info.length
        end
        audio.duration = duration
        if audio.save
          @episode.audio_id = audio.id
          @episode.duration = duration
        end
      elsif !@episode.paid
        same_day_episode = Episode.free.where(title: @episode.title, play_date: @episode.play_date, series_id: @episode.series.id).where.not(id: @episode.id).first
        if same_day_episode.present?
          @episode.audio_id = same_day_episode.audio_id
          @episode.duration = same_day_episode.duration
        end
      end
      if params[:episode][:image_attributes].present? && params[:episode][:image_attributes]["attachment"].present?
        image_file_name = params[:episode][:image_attributes]["attachment"].original_filename
        image = Image.where("attachment LIKE ?", "#{image_file_name}").first
        image.attachment = params[:episode][:image_attributes]["attachment"] if image.present?
        image = Image.new(attachment: params[:episode][:image_attributes]["attachment"]) if image.nil?
        if image.save
          @episode.image_id = image.id
        end
      end
    end
end
