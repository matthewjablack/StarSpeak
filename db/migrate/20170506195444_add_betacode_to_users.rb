class AddBetacodeToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :betacode_id, :integer
  end
end
