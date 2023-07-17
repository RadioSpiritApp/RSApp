class Admin::PlansController < Admin::BaseController
  before_action :set_bucket, only: [:edit, :update, :destroy, :activate_deactivate]

  def index
    @plans =
      if params[:search_query].present?
        Plan.search(params[:search_query])
      else
        Plan.all
      end
    @plans = @plans.order(:id).paginate(page: params[:page], per_page: 20)
  end

  def new
    @plan = Plan.new
  end

  def edit
  end

  def create
    @plan = Plan.new(plan_params)
    if @plan.save
      redirect_to admin_plans_path, notice: I18n.t('plans.action_success_message', message: 'created')
    else
      render :new
    end
  end

  def update
    if @plan.update(plan_params)
      redirect_to admin_plans_path, notice: I18n.t('plans.action_success_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @plan.destroy
      redirect_to admin_plans_path, notice: I18n.t('plans.action_success_message', message: 'destroyed')
    else
      redirect_to admin_plans_path, notice: I18n.t('plans.destroy_failure')
    end
  end

  def activate_deactivate
    @plan.toggle(:active)
    @plan.save
    redirect_to admin_plans_path
  end

  private

    def set_bucket
      @plan = Plan.find_by_id(params[:plan_id] || params[:id])
      return true if @plan.present?
      flash[:alert] = "Plan not found."
      redirect_to admin_plans_path
    end

    def plan_params
      params.require(:plan).permit(:title, :validity, :amount, :active, :itunes_id, :play_store_id)
    end
end
