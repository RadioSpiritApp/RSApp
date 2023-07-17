module CustomEncDec
  class << self
    # Encrypts the plain_text with the provided key
    def encrypt(plain_text, key)
      ::CustomEncDec::CustomEncDec.new(key).encrypt(plain_text)
    end

    # Decrypts the cipher_text with the provided key
    def decrypt(cipher_text, key)
      ::CustomEncDec::CustomEncDec.new(key).decrypt(cipher_text)
    end

    # Generates a random key of the specified length in bits
    # Default format is :plain
    def generate_key(length = 256)
      ::CustomEncDec::CustomEncDec.new("").random_key(length)
    end
  end

  class CustomEncDec
    attr :key

    def initialize(key)
      @key = key
      @characters = [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".",
                     "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=",
                     ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
                     "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[",
                     "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
                     "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    end

    # Encrypts
    def encrypt(plain_text)
      encryption_algo(plain_text, shift_by)
    end

    # Decrypts
    def decrypt(cipher_text)
      decryption_algo(cipher_text, shift_by)
    end

    # Generate a random key
    def random_key(length=256)
      _random_seed.unpack('H*')[0][0..((length/8)-1)]
    end

    private

      # Generates a random seed value
      def _random_seed(size=32)
        if defined? OpenSSL::Random
          return OpenSSL::Random.random_bytes(size)
        else
          chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
          (1..size).collect{|a| chars[rand(chars.size)] }.join
        end
      end

      def shift_by
        @key.sum % 26
      end

      def encryption_algo(str, n)
        enc = str.chars.map {|x| @characters.include?(x) ? @characters[(@characters.find_index(x) + n) % 91] : x}.join
        Base64.encode64(enc).chomp
      end

      def decryption_algo(str, n)
        dec = Base64.decode64(str)
        dec.chars.map {|x| @characters.include?(x) ? @characters[(@characters.find_index(x) - n + 91) % 91] : x}.join
      end
  end
end
