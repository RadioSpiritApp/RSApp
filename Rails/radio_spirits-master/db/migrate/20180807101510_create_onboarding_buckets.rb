class CreateOnboardingBuckets < ActiveRecord::Migration[5.2]
  def change
    create_table :onboarding_buckets do |t|
      t.string :title
      t.integer :show_signup_after
      t.integer :skip_signup_for
      t.boolean :show_signup
      t.boolean :show_rv_login
      t.boolean :active, default: true
      t.timestamps
    end
  end
end
