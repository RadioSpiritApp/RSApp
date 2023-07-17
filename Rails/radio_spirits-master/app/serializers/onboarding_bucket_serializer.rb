class OnboardingBucketSerializer < ActiveModel::Serializer
  attributes :id, :title, :show_signup_after, :skip_signup_for, :show_signup, :show_rv_login
end
