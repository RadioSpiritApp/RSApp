# frozen_string_literal: true

module FlashHelper
  ALERT_TYPES = %i[danger info success warning].freeze unless const_defined?(:ALERT_TYPES)

  def bootstrap_flash
    flash_messages = []
    flash.each do |type, message|
      next if message.blank?

      type = get_flash_type(type)
      next unless ALERT_TYPES.include?(type)

      Array(message).each do |msg|
        flash_messages << get_message_text(type, message) if msg
      end
    end
    flash_messages.join("\n").html_safe
  end

  def get_flash_type(type)
    type = type.to_sym
    type = :success if type == :notice
    type = :danger if type == :alert
    type
  end

  def get_message_text(type, message)
    content_tag(:div,
                content_tag(:button, raw('&times;'), class: 'close', 'data-dismiss' => 'alert') +
                message.html_safe, class: "alert fade in alert-#{type}")
  end
end
