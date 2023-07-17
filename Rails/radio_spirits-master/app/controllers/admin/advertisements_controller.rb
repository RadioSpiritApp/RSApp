class Admin::AdvertisementsController < Admin::BaseController

  require "mp3info"
  before_action :set_ad, only: [:edit, :update, :destroy, :activate_deactivate]

  def index
    @advertisements =
      if params[:search_query].present?
        Advertisement.search(params[:search_query])
      else
        Advertisement.all
      end
    @advertisements = @advertisements.order(:id).paginate(page: params[:page], per_page: 20)
  end

  def new
    @advertisement = Advertisement.new
    @advertisement.build_image
    @advertisement.build_audio
  end

  def edit; end

  def create
    @advertisement = Advertisement.new(advertisement_params)
    assign_media_attributes(params)
    if @advertisement.save
      redirect_to admin_advertisements_path, notice: I18n.t('ads.action_success_message', message: 'created')
    else
      render :new
    end
  end

  def update
    assign_media_attributes(params)
    if @advertisement.update(advertisement_params)
      @advertisement.update_content
      redirect_to admin_advertisements_path, notice: I18n.t('ads.action_success_message', message: 'updated')
    else
      render :edit
    end
  end


  def activate_deactivate
    @advertisement.toggle(:active)
    @advertisement.save
    redirect_to admin_advertisements_path
  end

  def destroy
    @advertisement.destroy
    redirect_to admin_advertisements_path, notice: I18n.t('ads.action_success_message', message: 'destroyed')
  end

  private
    def set_ad
      @advertisement = Advertisement.find_by_id(params[:advertisement_id] || params[:id])
      return true if @advertisement.present?
      flash[:alert] = "Advertisement not found."
      redirect_to admin_advertisements_path
    end

    def advertisement_params
      params.require(:advertisement).permit(:title, :ad_type, :redirect_url, :duration)
    end

    def assign_media_attributes(params)
      if params[:advertisement][:audio_attributes].present? && params[:advertisement][:audio_attributes]["attachment"].present?
        duration = nil
        audio_file_name = params[:advertisement][:audio_attributes]["attachment"].original_filename.gsub(/[ ()]/,'_').gsub(". ", ".").gsub(",", "_")
        audio = Audio.where("attachment LIKE ?", "#{audio_file_name}").first
        audio.attachment = params[:advertisement][:audio_attributes]["attachment"] if audio.present?
        audio = Audio.new(attachment: params[:advertisement][:audio_attributes]["attachment"]) if audio.nil?
        Mp3Info.open(params[:advertisement][:audio_attributes]["attachment"].tempfile) do |mp3info|
          duration = mp3info.length
        end
        audio.duration = duration
        if audio.save
          @advertisement.audio_id = audio.id
        end
      end
      if params[:advertisement][:image_attributes].present? && params[:advertisement][:image_attributes]["attachment"].present?
        image_file_name = params[:advertisement][:image_attributes]["attachment"].original_filename
        image = Image.where("attachment LIKE ?", "#{image_file_name}").first
        image.attachment = params[:advertisement][:audio_attributes]["attachment"] if image.present?
        image = Image.new(attachment: params[:advertisement][:image_attributes]["attachment"]) if image.nil?
        if image.save
          @advertisement.image_id = image.id
        end
      end
    end
end
