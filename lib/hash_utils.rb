module HashUtils
  extend self

  def deep_symbolize_keys(hash)
    return hash.reduce({}) do |memo, (k, v)|
      memo.tap { |m| m[k.to_sym] = v.deep_symbolize_keys }
    end if hash.is_a? Hash
    
    return hash.reduce([]) do |memo, v| 
      memo << v.deep_symbolize_keys; memo
    end if hash.is_a? Array
    
    hash
  end
end