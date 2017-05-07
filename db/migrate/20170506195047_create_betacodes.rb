class CreateBetacodes < ActiveRecord::Migration[5.0]
  def change
    create_table :betacodes do |t|
      t.string :name
      t.string :token

      t.timestamps
    end
  end
end
