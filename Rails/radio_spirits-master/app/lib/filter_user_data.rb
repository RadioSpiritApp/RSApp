class FilterUserData

  def initialize(search_query, date_range, user_type)
    @search_query = search_query
    @date_range = date_range
    @user_type = user_type
  end

  def call
    get_result
  end


  private

  def get_result
    filtered_results = get_results_by_filter.compact
    if @search_query.present?
      filtered_results = filtered_results.select{|result| result if result["email"]&.downcase&.include?(@search_query.downcase) || result["reference_id"]&.downcase&.include?(@search_query.downcase)}
    elsif @date_range.present? && filtered_results.present?
      start_date = Date.strptime(@date_range.partition('-').first.gsub(/\s+/, ''), "%m/%d/%Y")
      end_date = Date.strptime(@date_range.partition('-').last.gsub(/\s+/, ''), "%m/%d/%Y")
      filtered_results = filtered_results.select{|result| result if result["installation_date"].present? && (start_date.midnight..end_date.end_of_day).include?(result["installation_date"].to_date)}
    end
    filtered_results
  end

  def get_results_by_filter
    all_results = ActiveRecord::Base.connection.execute("SELECT devices.id as device_id, devices.user_id, devices.udid, devices.created_at as installation_date, devices.reference_id, users.id as users_id, users.email FROM devices FULL OUTER JOIN users ON devices.user_id = users.id").to_a
    case @user_type
    when "Free"
      all_results.select{|result| result if result["user_id"].nil? && result["udid"].present?}
    when "FreeAndRegistered"
      user_ids = Subscription.joins(:user).pluck(:user_id)
      all_results.select{|result| result if result["user_id"].present? && !user_ids.include?(result["user_id"]  || result["users_id"])}
    when "RadioSpirits"
      user_ids = Subscription.joins(:user).where("subscriptions.type = ?", Subscription::RS).pluck(:user_id)
      all_results.select{|result| result if user_ids.include?(result["user_id"] || result["users_id"])}
    when "RadioVault"
      user_ids = Subscription.joins(:user).where("subscriptions.type = ?", Subscription::RV).pluck(:user_id)
      all_results.select{|result| result if user_ids.include?(result["user_id"] || result["users_id"])}
    else
      all_results
    end
  end
end
