class AddFullNameMigration < ActiveRecord::Migration[5.0]
  def change
  	User.all.each do |user|
  		user.update_columns(name: user.first_name + ' ' + user.last_name)
  	end
  end
end
