class Admin::SettingsController < Admin::BaseController

  before_action :set_setting, only: [:edit, :update,]

  def index
    @settings = Setting.where.not(name: Setting::HOME_PAGE_CONTENT).paginate(page: params[:page], per_page: 20)
  end

  def edit
  end

  def update
    if @setting.update(setting_params)
      redirect_to admin_settings_path, notice: I18n.t('settings.action_success_message', message: 'updated')
    else
      render :edit
    end
  end

  def edit_home_page_content
    @settings = Setting.where(name: Setting::HOME_PAGE_CONTENT).order(:id)
  end

  def update_home_page_content
    Setting.where(name: Setting::HOME_PAGE_CONTENT).update_all(value: "false")
    params[:values].each do |id, value|
      Setting.find(id).update(value: value)
    end
    redirect_to admin_settings_path, notice: I18n.t('settings.action_success_message', message: 'updated')
  end

  private
    def set_setting
      @setting = Setting.find_by_id(params[:id])
      return true if @setting.present?
      flash[:alert] = "Setting not found."
      redirect_to admin_settings_path
    end

    def setting_params
      params.require(:setting).permit(:value)
    end
end
