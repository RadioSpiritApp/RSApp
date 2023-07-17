class Admin::AudiosController < Admin::BaseController

  before_action :set_audio, only: [:destroy]

  def index
    @audios = Audio.all
    respond_to do |format|
      format.html do
        @audios = @audios.paginate(:page => params[:page], :per_page => 20)
      end
      format.xlsx{
        response.headers['Content-Disposition'] = "attachment; filename=\"Uploaded Audios-#{Time.current.strftime("%b %d %I:%M%p")}.xlsx\""
      }
    end
  end

  def bulk_upload
    if params[:bulk_audios].present? && params[:bulk_audios][:audios].present?
      folder = "images_#{Time.current.to_i.to_s}"
      audios_path_array = []
      params[:bulk_audios][:audios].each do |audio|
        FileUtils::mkdir_p "public/bulk_audios/#{folder}"
        audio_file_path = File.join("public", "bulk_audios", "#{folder}", audio.original_filename)
        audio_file = audio.tempfile
        FileUtils.cp audio_file, audio_file_path
        audios_path_array << audio_file_path
      end
      AudioUploadWorker.perform_async(audios_path_array, folder)
      flash[:success] = 'Audios upload process working in background.'
    else
      flash[:alert] = 'Please upload only audio file.'
    end
    redirect_to admin_audios_path
  end

  def destroy
    if @audio.destroy
      redirect_to admin_audios_path, notice: I18n.t('audios.audio_message', message: 'destroyed')
    else
      redirect_to admin_audios_path, notice: I18n.t('audios.not_destroy')
    end
  end


  def copy_audio
    CopyAudioImportWorker.perform_async()
    redirect_to admin_audios_path
    flash[:success] = 'Audios import process working in background.'
  end

  def update_audio
    UpdateAudioImportWorker.perform_async()
    redirect_to admin_audios_path
    flash[:success] = 'Audios import process working in background.'
  end

  private

    def set_audio
      @audio = Audio.find_by_id(params[:id])
      return true if @audio.present?
      flash[:alert] = "Audio not found."
      redirect_to admin_audios_path
    end
end
