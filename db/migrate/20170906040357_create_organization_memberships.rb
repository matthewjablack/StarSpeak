class CreateOrganizationMemberships < ActiveRecord::Migration[5.0]
  def change
    create_table :organization_memberships do |t|
      t.integer :organization_id
      t.integer :user_id
      t.boolean :admin

      t.timestamps
    end
  end
end
