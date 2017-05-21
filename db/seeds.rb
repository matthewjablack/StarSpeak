# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create!(email: 'matteblack@gmail.com', password: 'matte123', password_confirmation: 'matte123', 
	level_id: 1, first_name: 'Matte', last_name: 'Black', betacode_id: 1, admin: true)
User.create!(email: 'dillpickle@gmail.com', password: 'pickles123', password_confirmation: 'pickles123', 
	level_id: 1, first_name: 'Dill', last_name: 'Pickle', betacode_id: 1, admin: true)


Betacode.create!(name: 'StarSpeak Team', token: 'starspeak-team')

Level.create!(name: 'Beta')

Moduler.create!(name: 'Module 1', level_id: 1, sort_order: 1)
Moduler.create!(name: 'Module 2', level_id: 1, sort_order: 2)

Lesson.create!(name: 'Lesson 1', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 1,
	content: 'You forgot to do your homework and your teacher was upset with you. What should you do?')
Lesson.create!(name: 'Lesson 2', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 2,
	content: 'What would you do if you won a million dollars?')
Lesson.create!(name: 'Lesson 3', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 3,
	content: 'When you grow up, would you prefer to live in the city or in the country? Explain your choice.')
Lesson.create!(name: 'Lesson 4', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 4,
	content: 'What is your dream job? What would it involve? Why is it your dream job?')
Lesson.create!(name: 'Lesson 5', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 5,
	content: 'Are teenagers that regularly play violent video games more prone to violence? Justify your point of view.')
Lesson.create!(name: 'Lesson 6', level_id: 1, moduler_id: 1, length: 20, prep: 10, sort_order: 6,
	content: 'Do you believe that graffiti is a form of vandalism or a form of art? Explain your opinion.')

Lesson.create!(name: 'Lesson 7', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 7,
	content: '	What is the most ridiculous thing that has ever happened to you? What made the situation so funny?')
Lesson.create!(name: 'Lesson 8', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 8,
	content: 'Should you be allowed to bring your pet to school? Explain your point of view.')
Lesson.create!(name: 'Lesson 9', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 9,
	content: 'If you could spend a day with any celebrity, who would it be? Why?')
Lesson.create!(name: 'Lesson 10', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 10,
	content: 'Describe what you think would happen if we had to live a day without electricity.')
Lesson.create!(name: 'Lesson 11', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 11,
	content: 'What was the best vacation you have ever taken? Explain.')
Lesson.create!(name: 'Lesson 12', level_id: 1, moduler_id: 2, length: 20, prep: 10, sort_order: 12,
	content: 'What was the best vacation you have ever taken? This time you only have 10 seconds to explain.')

