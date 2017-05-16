class AddBrowserNameToSpeechstats < ActiveRecord::Migration[5.0]
  def change
    add_column :speechstats, :browser_name, :string
    add_column :speechstats, :browser_version, :string
  end
end
