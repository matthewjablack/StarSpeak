require 'test_helper'

class UserTest < ActiveSupport::TestCase
  setup do 
    @user = users(:john_black)
    @user.save
  end

  test 'user name should come from first and last name' do 
    assert_equal @user.first_name + ' ' + @user.last_name, @user.name
  end

  test 'user should have auth token' do 
    assert_not_equal nil, @user.auth_token
  end

  test 'user admin should be false by default' do 
    assert_equal false, @user.admin
  end
end
