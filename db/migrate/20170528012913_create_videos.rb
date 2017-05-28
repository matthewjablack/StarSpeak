class CreateVideos < ActiveRecord::Migration[5.0]
  def change
    create_table :videos do |t|
      t.string :direct_upload_url, null: false
      t.attachment :upload
      t.integer :status, default: 0, null: false
      t.timestamps
    end
    add_index :videos, :status
  end
end
