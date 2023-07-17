module API
  module V1
    class SubscriptionPlans < API::V1::Base
      include API::V1::Defaults
      resource :subscription_plans do
        helpers do
          def plans_serializable_data(plans)
            ActiveModelSerializers::SerializableResource.new(plans, each_serializer: PlanSerializer).serializable_hash
          end
        end
        desc "Get Plans", {
          headers: {
            "Authorization" => {
              description: "Authorization key",
              required: true
            }
          }
        }
        params do
          requires :udid, type: String, desc: "Unique Device Id"
        end
        get do
          success = true
          @device = Device.find_by(udid: params[:udid])
          error!({ success: false, message: 'This device is not registered' }, 400) if @device.blank?
          subscription_plans = @device.subscription_bucket.plans.active.order(:validity) rescue nil
          unless subscription_plans.blank?
            {success: true, message: "Subscription Plans fetched successfully", plans: plans_serializable_data(subscription_plans), all_plans: plans_serializable_data(Plan.all.order(:validity))}
          else
            {success: false, message: "Plans not found"}
          end
        end
      end
    end
  end
end
