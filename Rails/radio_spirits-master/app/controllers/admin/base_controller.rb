# frozen_string_literal: true

class Admin::BaseController < ApplicationController
  before_action :require_admin_login
  layout 'admin'

  protected

  def require_admin_login
    return true if current_user&.admin?
    flash[:alert] = "You don't have access for this section."
    redirect_to root_path
  end
end
