class SubscriptionSerializer < ActiveModel::Serializer
  attributes :id, :expiry_date, :transaction_identifier, :transaction_date, :is_expired, :plan_itunes_id, :plan_playstore_id, :plan_validity_text, :plan_amount, :plan_name, :autoRenewal, :transaction_receipt

  def is_expired
    object.expiry_date <= Date.today
  end

  def plan_itunes_id
    object&.plan&.itunes_id
  end

  def plan_playstore_id
    object&.plan&.play_store_id
  end

  def plan_validity_text
    object&.plan&.validity_text
  end

  def plan_amount
    object&.plan&.amount
  end

  def plan_name
    object&.plan&.title
  end

  def expiry_date
    object.expiry_date.to_datetime
  end

  def autoRenewal
    object.auto_renewal
  end
end
