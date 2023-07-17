User.create(email: 'admin@radiospirits.com', password: '123456', role: User::ADMIN)
ActiveRecord::Base.connection.execute("TRUNCATE settings RESTART IDENTITY")
setting_name_array = ["featured episode limit", "featured series limit", "more of section", "featured section", "popular section", "when radio was section", "recently added section", "continue listening", "user download limit"]
setting_value_array = [15,15,"true","true","true","true","true", "true", 20]

setting_name_array.each_with_index do |name,index|
  Setting.create(name: name, value: setting_value_array[index])
end
ActiveRecord::Base.connection.execute("TRUNCATE copy_texts RESTART IDENTITY")
copy_texts_objects =  [
                        {page_name: "signup_with_email", key: "heading", value: "Listen for Free!"},
                        {page_name: "signup_with_email", key: "sub_heading", value: "Your free trial is expired! Please subscribe to continue"},
                        {page_name: "signup_with_email", key: "button_text", value: "SUBMIT"},
                        {page_name: "signup_without_email", key: "heading", value: "Listen for Free!"},
                        {page_name: "signup_without_email", key: "sub_heading", value: "Your free trial is expired! Please subscribe to continue"},
                        {page_name: "signup_without_email", key: "button_text", value: "VIEW PREMIUM PLANS"},
                        {page_name: "free_user_block_popup", key: "heading", value: "Premium Show"},
                        {page_name: "free_user_block_popup", key: "sub_heading", value: "Mystery! Comedy! Drama! Westerns! Adventure!"},
                        {page_name: "free_user_block_popup", key: "description_1", value: "This great radio show and thousands more like it, are only available with a Premium Account. Your Premium Account will give you-"},
                        {page_name: "free_user_block_popup", key: "pointer_1", value: "All show access"},
                        {page_name: "free_user_block_popup", key: "pointer_2", value: "Downloads for offline listening"},
                        {page_name: "free_user_block_popup", key: "pointer_3", value: "Personal Recommendations"},
                        {page_name: "free_user_block_popup", key: "pointer_4", value: "Bookmarks and Resume Play functionality"},
                        {page_name: "free_user_block_popup", key: "description_2", value: "Click below to see Premium Account Plans"},
                        {page_name: "free_user_block_popup", key: "button_text", value: "VIEW PREMIUM PLANS"},
                        {page_name: "subscription_plan", key: "footer", value: "All plans will auto-renew until canceled"},
                        {page_name: "free_user_my_library", key: "heading", value: "You are not subscribed yet"},
                        {page_name: "free_user_my_library", key: "sub_heading", value: "Please subscribe to manage Downloads and Bookmarks"},
                        {page_name: "free_user_my_library", key: "button_text", value: "VIEW PREMIUM PLANS"},
                        {page_name: "email_verification", key: "heading", value: "Please verify your email-id!"},
                        {page_name: "email_verification", key: "sub_heading", value: "An activation link has been sent on your email-id"},
                        {page_name: "email_verification", key: "button_text", value: "CONTINUE"}
                      ]
copy_texts_objects.each do |copy_text_object|
  CopyText.create(copy_text_object)
end
