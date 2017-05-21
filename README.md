StarSpeak
=======================

Online public speaking platform https://github.com/mattblackdesign/starspeak.

# Demo

https://starspeak.io

# Usage

  $ git clone git@github.com:mattBlackDesign/StarSpeak.git
  $ cd starspeak
  $ mv config/database.yml.default config/database.yml
  Edit database.yml
  $ bundle && yarn
  $ rake db:migrate
  $ yarn rails-server
  Open another console window
  $ rails s
