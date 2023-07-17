class Cache
  @cache_object = {}

  # 172_800 => 2 Days

  def self.fetch(key, expires_in = 172_800, &block)
    if @cache_object.key?(key) && (@cache_object[key][:expiration_time] > Time.current.to_i)
      # fetch and return result
      # puts "fetch from cache and will expire in #{@cache_object[key][:expiration_time] - Time.current.to_i} seconds"
      @cache_object[key][:value]
    elsif block_given?
      # puts "did not find key in cache, executing block ..."
      @cache_object[key] = { value: yield(block), expiration_time: Time.current.to_i + expires_in }
      @cache_object[key][:value]
    end
  end

  def self.rewrite_value(key, expires_in = 172_800, &block)
    if block_given?
      # puts "Re-write #{key} value"
      @cache_object[key] = { value: yield(block), expiration_time: Time.current.to_i + expires_in }
    end
  end

  def self.delete_key(key)
    @cache_object.delete(key)
  end
end
