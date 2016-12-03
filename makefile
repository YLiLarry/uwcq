dev:
		ember build
		cp -r dist /Library/WebServer/Documents/dist
		find /Library/WebServer/Documents -type f -exec chmod a+r {} \;
		find /Library/WebServer/Documents -type d -exec chmod a+rx {} \;
		