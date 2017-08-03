#!/bin/bash
osascript -e 'tell application "Terminal"
	activate
	if exists window 1 then
        do script "cd ~/side/StarSpeak" in selected tab of the front window
	do script "redis-server /usr/local/etc/redis.conf" in selected tab of the front window
    else
        do script "cd ~/side/StarSpeak"
	do script "redis-server /usr/local/etc/redis.conf"
    end if
    delay 1
    tell application "System Events"
        keystroke "t" using {command down}
    end tell
    do script "cd ~/side/StarSpeak" in selected tab of the front window
    do script "bundle exec sidekiq" in selected tab of the front window
    delay 1
    tell application "System Events"
        keystroke "t" using {command down}
    end tell
    do script "cd ~/side/StarSpeak" in selected tab of the front window
    do script "yarn rails-server" in selected tab of the front window
    delay 1
    tell application "System Events"
        keystroke "t" using {command down}
    end tell
    do script "cd ~/side/StarSpeak" in selected tab of the front window
    do script "rails s" in selected tab of the front window
end tell'
