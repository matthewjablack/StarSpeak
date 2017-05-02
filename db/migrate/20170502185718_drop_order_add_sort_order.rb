class DropOrderAddSortOrder < ActiveRecord::Migration[5.0]
  def change
  	add_column :lessons, :sort_order, :integer
  	add_column :modulers, :sort_order, :integer
  	remove_column :lessons, :order
  	remove_column :modulers, :order
  end
end
