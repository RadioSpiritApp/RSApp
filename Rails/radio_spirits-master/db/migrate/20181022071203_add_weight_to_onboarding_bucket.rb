class AddWeightToOnboardingBucket < ActiveRecord::Migration[5.2]
  def change
  	add_column :onboarding_buckets, :weight, :integer, null: false, default: 1
  end
end
