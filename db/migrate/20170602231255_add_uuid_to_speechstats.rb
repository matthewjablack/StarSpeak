class AddUuidToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :uuid, :string
  end
end
