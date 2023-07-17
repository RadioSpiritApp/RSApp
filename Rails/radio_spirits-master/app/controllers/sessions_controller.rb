# frozen_string_literal: true

class SessionsController < Devise::SessionsController
  protected

  def after_sign_in_path_for(resource_or_scope)
    return admin_users_path if current_user&.admin?
    super
  end
end
