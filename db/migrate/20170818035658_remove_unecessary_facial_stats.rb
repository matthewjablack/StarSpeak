class RemoveUnecessaryFacialStats < ActiveRecord::Migration[5.0]
  def change
    remove_column :facial_stats, :facial_appearance_stat_id
    remove_column :facial_stats, :facial_emotion_stat_id
    remove_column :facial_stats, :facial_expression_stat_id
    remove_column :facial_stats, :facial_emoji_stat_id
  end
end
