StarSpeak
=======================

Online public speaking platform https://github.com/mattblackdesign/starspeak.

# Demo

https://starspeak.io

#Dependencies
1. Install Rails https://gorails.com/setup/osx/10.12-sierra
2. Install yarn `brew install yarn`
3. Install Redis `brew install redis`
4. Install Postgres (scroll down) https://gorails.com/setup/osx/10.12-sierra

# Installation
1. `git clone git@github.com:mattBlackDesign/StarSpeak.git`
2. `cd starspeak`
3. `mv config/database.yml.default config/database.yml`
4. `mv config/application.yml.default config/application.yml`
4. Edit database.yml and application.yml
5. `bundle && yarn`
6. `rake db:create`
7. `rake db:migrate`
8. `rake db:seed`
9. `rake db:migrate`
10. `chmod +x  ./start.sh`
11. `./start.sh`

If the startup script does not work, try running these commands manually:

1. `redis-server /usr/local/etc/redis.conf` (Required for Sidekiq)
2. `bundle exec sidekiq` (in new tab) (Required for video uploading)
3. `yarn rails-server` (in new tab) (Required for React assets)
4. `rails s` (in new tab) (Required for rails server)
