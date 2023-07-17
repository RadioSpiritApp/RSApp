class UserSerializer < ActiveModel::Serializer

  attributes :id, :email, :first_name, :last_name, :access_token, :user_type, :is_paid_user, :page_details, :subscription, :transaction_identifier

  def access_token
    scope[:access_token]
  end

  def user_type
    scope[:user_type]
  end

  def is_paid_user
    scope[:is_paid_user]
  end

  def page_details
    scope[:page_details]
  end

  def subscription
    subscription = if access_token.present? && AccessToken.find_by_token(access_token).is_rv_subscribed
        object.subscriptions.where("expiry_date >= ? AND  type = ?", Date.today, Subscription::RV).last
      elsif object.subscriptions.where("expiry_date >= ? AND  type = ?", Date.today, Subscription::RS).present?
        object.subscriptions.where("expiry_date >= ? AND  type = ?", Date.today, Subscription::RS).last
      end
    SubscriptionSerializer.new(subscription) if subscription.present?
  end
end
