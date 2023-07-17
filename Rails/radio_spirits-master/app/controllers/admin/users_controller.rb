class Admin::UsersController < Admin::BaseController
  require 'will_paginate/array'

  def index
    @result_keys = FilterUserData.new(params[:search_query], params[:date_range], params[:user_type]).call.paginate(page: params[:page], per_page: 20)
    @results = @result_keys.group_by{|r| r["user_id"]}.reverse_each
  end

  def suspend_or_activate
    user = Subscriber.find(params[:user_id])
    user.toggle(:suspended)
    if user.save
      if user.suspended?
        user.access_tokens.destroy_all
        user.devices.update_all(user_id: nil)
      end
      flash[:success] = user.suspended? ? "User suspended successfully" : "User activated successfully"
    else
      flash[:alert] = "Something went wrong. Please try later"
    end
    redirect_to admin_users_path
  end

  def read_notification
    notification = Notification.find(params[:notification_id])
    if notification.present?
      if notification.update_attribute('read', true)
        response = {success: true, message: 'Notification read', status: 200}
      else
        response = {success: false, message: 'Unable to update notification', status: 500}
      end
    else
      response = {success: false, message: 'Notification not found', status: 400}
    end
    respond_to do |format|
      format.json { render json: response }
    end
  end

  def subscriptions
    results =  Subscription.filter_by_type(params[:subscription_type])
    results = results.joins(:user).where("users.email ILIKE ?", "%#{params[:search_query]}%") if params[:search_query].present?
    @results = results.paginate(page: params[:page], per_page: 20)
    @subscriptions = @results.group_by(&:user_id)
  end
end
