class TransferSpeechstatData < ActiveRecord::Migration[5.0]
  def change
  	Speechstats.all.each do |speechstat|
  		SpeechStat.create!(speechstat.attributes)
  	end
  end
end
