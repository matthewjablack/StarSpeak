class AddPrepToLessons < ActiveRecord::Migration[5.0]
  def change
    add_column :lessons, :prep, :integer
  end
end
