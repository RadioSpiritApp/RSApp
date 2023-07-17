class Admin::ImagesController < Admin::BaseController
  require 'csv_exporter'
  before_action :set_image, only: [:destroy]

  def index
    @images = Image.all
    respond_to do |format|
      format.html do
        @images = @images.paginate(:page => params[:page], :per_page => 20)
      end
      format.xlsx {
        response.headers['Content-Disposition'] = "attachment; filename=\"Uploaded Images-#{Time.zone.now.strftime("%b %d %I:%M%p")}.xlsx\""
      }
    end
  end

  def image_bulk_upload
    if params[:bulk_images].present? && params[:bulk_images][:images].present?
      folder = "images_#{Time.current.to_i.to_s}"
      images_path_array = []
      params[:bulk_images][:images].each do |image|
        FileUtils::mkdir_p "public/bulk_images/#{folder}"
        image_file_path = File.join("public", "bulk_images", "#{folder}", image.original_filename)
        image_file = image.tempfile
        FileUtils.cp image_file, image_file_path
        images_path_array << image_file_path
      end
      #BulkImagesUploaderWorker.perform_async(folder)
      ImageUploadWorker.perform_async(images_path_array, folder)
      flash[:success] = 'Images upload process working in background.'
    else
      flash[:alert] = 'Please upload only image file.'
    end
    redirect_to admin_images_path
  end

  def destroy
    if @image.destroy
      if params[:return_to].present? && params[:return_to] == "episodes"
        redirect_to admin_episodes_path, notice: I18n.t('images.image_message', message: 'destroyed')
      else
        redirect_to admin_images_path, notice: I18n.t('images.image_message', message: 'destroyed')
      end
    else
      redirect_to admin_images_path, notice: I18n.t('images.not_destroy')
    end
  end

  def copy_image
    CopyImageImportWorker.perform_async()
    redirect_to admin_images_path
    flash[:success] = 'Images import process working in background.'
  end

  def update_image
    UpdateImageImportWorker.perform_async()
    redirect_to admin_images_path
    flash[:success] = 'Images import process working in background.'
  end

  private

    def set_image
      @image = Image.find_by_id(params[:id])
      return true if @image.present?
      flash[:alert] = "Image not found."
      redirect_to admin_images_path
    end
end
