class CreateIpSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :ip_sessions do |t|
      t.string :ip
      t.integer :count, default: 0

      t.timestamps
    end
  end
end
