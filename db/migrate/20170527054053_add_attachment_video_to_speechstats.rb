class AddAttachmentVideoToSpeechstats < ActiveRecord::Migration
  def self.up
    change_table :speechstats do |t|
      t.attachment :video
    end
  end

  def self.down
    remove_attachment :speechstats, :video
  end
end
