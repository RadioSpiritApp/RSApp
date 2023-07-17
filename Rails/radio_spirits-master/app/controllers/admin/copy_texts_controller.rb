class Admin::CopyTextsController < Admin::BaseController

  before_action :set_page_name, only: :edit_page_details

  def index
    @copy_texts = CopyText.all.group_by{|copy_text| copy_text.page_name}
  end

  def edit_page_details
    @page_name = params[:page_name]
  end

  def update_page_details
    params[:values].each do |id, value|
      CopyText.find(id).update(value: value)
    end
    redirect_to admin_copy_texts_path
  end

  private
    def set_page_name
      @copy_texts = CopyText.where(page_name: params[:page_name]).order(:id)
      if @copy_texts.blank?
        flash[:alert] = "Page not found"
        redirect_to admin_copy_texts_path
      end
    end

    def copy_text_params
      params.require(:copy_text).permit(:value)
    end
end
