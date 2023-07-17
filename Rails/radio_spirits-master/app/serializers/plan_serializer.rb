class PlanSerializer < ActiveModel::Serializer
  attributes :id, :title, :amount, :validity_text, :itunes_id, :play_store_id

  def validity_text
    object.validity_text
  end
end
