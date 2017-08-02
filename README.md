StarSpeak
=======================

Online public speaking platform https://github.com/mattblackdesign/starspeak.

# Demo

https://starspeak.io

# Installation
1. `git clone git@github.com:mattBlackDesign/StarSpeak.git`
2. `cd starspeak`
3. `mv config/database.yml.default config/database.yml`
4. Edit database.yml and application.yml
5. `bundle && yarn`
6. `rake db:migrate`
7. `brew install redis`
8. `redis-server /usr/local/etc/redis.conf` 
9. `bundle exec sidekiq` (in new tab)
10. `yarn rails-server` (in new tab)
11. `rails s` (in new tab)
