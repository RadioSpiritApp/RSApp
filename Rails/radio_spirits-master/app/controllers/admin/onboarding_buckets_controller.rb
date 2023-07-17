class Admin::OnboardingBucketsController < Admin::BaseController
  before_action :set_bucket, only: [:edit, :update, :destroy, :activate_deactivate, :empty]

  def index
    @onboarding_buckets =
      if params[:search_query].present?
        OnboardingBucket.search(params[:search_query])
      else
        OnboardingBucket.all
      end
    @onboarding_buckets = @onboarding_buckets.order(:id).paginate(page: params[:page], per_page: 20)
  end

  def new
    @onboarding_bucket = OnboardingBucket.new
  end

  def edit
  end

  def create
    @onboarding_bucket = OnboardingBucket.new(onboarding_bucket_params)
    if @onboarding_bucket.save
      redirect_to admin_onboarding_buckets_path, notice: I18n.t('onboarding_buckets.action_success_message', message: 'created')
    else
      render :new
    end
  end

  def update
    if @onboarding_bucket.update(onboarding_bucket_params)
      redirect_to admin_onboarding_buckets_path, notice: I18n.t('onboarding_buckets.action_success_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @onboarding_bucket.destroy
      redirect_to admin_onboarding_buckets_path, notice: I18n.t('onboarding_buckets.action_success_message', message: 'destroyed')
    else
      redirect_to admin_onboarding_buckets_path, notice: I18n.t('onboarding_buckets.destroy_failure')
    end
  end

  def activate_deactivate
    @onboarding_bucket.toggle(:active)
    @onboarding_bucket.save
    redirect_to admin_onboarding_buckets_path
  end

  def empty
    @onboarding_bucket.destroy_linked_subscribers
    redirect_to admin_onboarding_buckets_path, notice: I18n.t('onboarding_buckets.empty_bucket_message')
  end

  private

    def set_bucket
      @onboarding_bucket = OnboardingBucket.find_by_id(params[:onboarding_bucket_id] || params[:id])
      return true if @onboarding_bucket.present?
      flash[:alert] = "Onboarding Bucket not found."
      redirect_to admin_onboarding_buckets_path
    end

    def onboarding_bucket_params
      params.require(:onboarding_bucket).permit(:title, :show_signup_after, :skip_signup_for,
                                                :show_signup, :show_rv_login, :active, :weight)
    end
end
