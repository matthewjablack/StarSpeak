class AddVideoIdToSpeechstat < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :video_id, :integer
  end
end
