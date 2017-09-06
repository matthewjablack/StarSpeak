class CreateGroupMemberships < ActiveRecord::Migration[5.0]
  def change
    create_table :group_memberships do |t|
      t.integer :group_id
      t.integer :user_id
      t.boolean :admin

      t.timestamps
    end
  end
end
