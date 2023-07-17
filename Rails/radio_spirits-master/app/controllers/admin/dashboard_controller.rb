# frozen_string_literal: true

class Admin::DashboardController < Admin::BaseController
  def index
    @subscribers = Subscriber.all.paginate(page: params[:page], per_page: 20)
  end
end
