dep:
		ember build
		sudo rm -r /Library/WebServer/Documents/dist
		sudo cp -r dist /Library/WebServer/Documents
		sudo find /Library/WebServer/Documents -type f -exec chmod a+r {} \;
		sudo find /Library/WebServer/Documents -type d -exec chmod a+rx {} \;
		sudo chmod -R a+x /Library/WebServer/Documents/dist/api/v1
		sudo apachectl restart
		