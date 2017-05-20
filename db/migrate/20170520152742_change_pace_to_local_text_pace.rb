class ChangePaceToLocalTextPace < ActiveRecord::Migration[5.0]
  def change
  	Speechstat.all.each do |speechstat|
  		speechstat.update_attributes(local_text_pace: speechstat.pace)
  	end
  end
end
