class Admin::SubscriptionBucketsController < Admin::BaseController
  before_action :set_bucket, only: [:edit, :update, :destroy, :activate_deactivate]

  def index
    @subscription_buckets =
      if params[:search_query].present?
        SubscriptionBucket.search(params[:search_query])
      else
        SubscriptionBucket.all
      end
    @subscription_buckets = @subscription_buckets.order(:id).paginate(page: params[:page], per_page: 20)
  end

  def new
    @subscription_bucket = SubscriptionBucket.new
    @subscription_bucket.subscription_bucket_plans.build
  end

  def edit
  end

  def create
    @subscription_bucket = SubscriptionBucket.new(subscription_bucket_params)
    if @subscription_bucket.save
      redirect_to admin_subscription_buckets_path, notice:  I18n.t('subscription_buckets.action_success_message', message: 'created')
    else
      render :new
    end
  end

  def update
    if @subscription_bucket.update(subscription_bucket_params)
      redirect_to admin_subscription_buckets_path, notice: I18n.t('subscription_buckets.action_success_message', message: 'updated')
    else
      render :edit
    end
  end

  def destroy
    if @subscription_bucket.destroy
      redirect_to admin_subscription_buckets_path, notice: I18n.t('subscription_buckets.action_success_message', message: 'destroyed')
    else
      redirect_to admin_subscription_buckets_path, notice: I18n.t('subscription_buckets.destroy_failure')
    end
  end

  def activate_deactivate
    @subscription_bucket.toggle(:active)
    @subscription_bucket.save
    redirect_to admin_subscription_buckets_path
  end

  private

    def set_bucket
      @subscription_bucket = SubscriptionBucket.find_by_id(params[:subscription_bucket_id] || params[:id])
      return true if @subscription_bucket.present?
      flash[:alert] = "Subscription Bucket not found."
      redirect_to admin_subscription_buckets_path
    end

    def subscription_bucket_params
      params.require(:subscription_bucket).permit(:title, :active, :weight, plan_ids: [])
    end
end
