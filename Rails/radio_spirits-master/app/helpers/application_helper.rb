module ApplicationHelper
  def errors_for(object)
    if object.errors.any?
      content_tag(:div, class: "panel panel-danger") do
        concat(content_tag(:div, class: "panel-heading") do
          concat(content_tag(:h4, class: "panel-title") do
            concat "#{pluralize(object.errors.count, "error")} prohibited this #{object.class.name.downcase} from being saved:"
          end)
        end)
        concat(content_tag(:div, class: "panel-body") do
          concat(content_tag(:ul) do
            object.errors.full_messages.each do |msg|
              concat content_tag(:li, msg)
            end
          end)
        end)
      end
    end
  end

  def nav_class(links_arr)
    navigation_class = ''
    links_arr.each do |link|
      recognized = Rails.application.routes.recognize_path(link)
      if recognized[:controller] == params[:controller] && recognized[:action] == params[:action]
        navigation_class += 'active '
      end
    end
    navigation_class
  end

  def aria_expanded(links_arr)
    links_arr.each do |link|
      recognized = Rails.application.routes.recognize_path(link)
      if recognized[:controller] == params[:controller] && recognized[:action] == params[:action]
        return 'true'
      end
    end
    'false'
  end

  def image_attached?(object)
    object&.image&.attachment.present?
  end

  def image_attached_url(object)
    object&.image&.cf_signed_url(:thumb)
  end

  def audio_attached?(object)
    object&.audio&.attachment.present?
  end

  def audio_file_name(object)
    object&.audio&.attachment&.file&.filename
  end

  def image_file_name(object)
    object&.image&.attachment&.file&.filename
  end

  def validation_class_for(copy_text)
    case copy_text.key
    when "heading"
      'max-30'
    when "sub_heading"
      'max-75'
    when "button_text"
      'max-25'
    when "description_1"
      'max-150'
    when "pointer_1"
      'max-50'
    when "pointer_2"
      'max-50'
    when "pointer_3"
      'max-50'
    when "pointer_4"
      'max-50'
    when "description_2"
      'max-75'
    when "footer"
      'max-1000'
    end
  end


  def get_unread_notification_count notifications
    notifications.select{|n| n.read == false}.size
  end

  def clickable_url(url)
    return "" if url.blank?
    unless (['http', 'https'].include?(URI.parse(url).scheme) rescue false)
      url = "http://"+url
    end
    url
  end

  def formated_date(date)
    if date.present?
      date.strftime("%-m/%-d/%Y")
    else
      ""
    end
  end

  def plan_amount_options
    options = []
    amount = 0.49
    while amount < 300 do
      options << prepare_plan_option(amount)
      if amount < 29.99
        amount += 0.5
      elsif amount < 124.99
        amount += 1
      elsif amount < 299.99
        amount += 5
      else
        break
      end
    end
    options += [
        ["$329.99", 329.99], ["$349.99", 349.99], ["$399.99", 399.99],
        ["$449.99", 449.99], ["$499.99", 499.99], ["$599.99", 599.99],
        ["$699.99", 699.99], ["$799.99", 799.99], ["$899.99", 899.99],
        ["$999.99", 999.99]
      ]
    options
  end

  def prepare_plan_option(amount)
    amount = amount.round(2)
    ["$#{amount}", amount]
  end

  def plan_validity_options
    [
      ["1 Week", 7], ["1 Month", 30], ["2 Months", 60],
      ["3 Months", 90], ["6 Months", 180], ["1 Year", 365]
    ]
  end

  def format_duration_time(episode_duration)
    return 'N/A' if episode_duration.blank?
    duration = Time.at(episode_duration.to_f).utc
    if duration.strftime('%H').to_i.zero?
      duration.strftime('%Mm %Ss')
      if duration.strftime('%M').to_i.zero?
        duration.strftime('%Ss')
      end
    end
  end

  def add_note_for_footer(copy_text)
    if copy_text.key == 'footer'
      '<b>Note: </b> Add ## as separator for bullet points'
    else
      ''
    end
  end

  def get_plan_for(user, device)
    return 'Free' if user.blank?
    return '-' if device.blank?
    plan_titles = []
    rs_plan_title = user.subscriptions.active.rs.where(platform: device&.device_type)&.last&.plan&.title
    plan_titles << rs_plan_title
    rv_plan_title = user.subscriptions.active.rv.where(platform: device&.device_type)&.last
    plan_titles << 'Radio Vault' if rv_plan_title.present?
    return plan_titles.compact.join(", ").presence || "Free"
  end
end
