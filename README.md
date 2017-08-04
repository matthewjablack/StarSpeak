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
8. `chmod +x  ./start.sh`
9. `./start.sh`

If the startup script does not work, try running these commands manually:

1. `redis-server /usr/local/etc/redis.conf` (Required for Sidekiq)
2. `bundle exec sidekiq` (in new tab) (Required for video uploading)
3. `yarn rails-server` (in new tab) (Required for React assets)
4. `rails s` (in new tab) (Required for rails server)
