# Cordova app with map functionality

Merged branch 'mapbox-gl' back on 'master'.

## Known issues:
* See current semi-blocking issue and workaround here:
http://stackoverflow.com/questions/42787016/mapbox-gl-js-wont-render-when-bundled-with-browserify.
And associated mapbox-gl-js bug report here: https://github.com/mapbox/mapbox-gl-js/issues/4453
Suggested: Mapbox team claims that they fixed the issue, haven't checked yet.

* Files `src/lib/App.js` and `src/lib/app.js` will conflict on Windows. The idea was to keep
class and singleton instance in separate files.
Suggested: Change `app.js` to ie `app.singleton.js`.

* Missing files for Cordova project; plugins and Android manifest - see below.

## Run in browser

Install gulp globally, then run dev environment in browser with gulp:
```bash
git checkout mapbox-gl
npm install
gulp
```
Gulp task `serve` waits for task `build:js` to end, it may take as much as 20-30 sec 
on startup, will be quicker when editing files.

### URL params

There are some handy url parameters you can use in development,
e.g. like this:  
http://localhost:8080/?mock-start=true&mock-interval=500&mapjs=mbgl
* mock-start # Values true | false; starts mocking positions immediately
* mock-interval # Values #ms; at which interval in ms to change mock position; default is 2000ms.
* mapjs # Values mbgl | leaflet; which map library to use; uses mbgl (mapbox-gl-js) by default

## Deploy to Android
I [jonas] made a silly mistake: I wiped the previous laptop clean and 
formatted the drive before I noticed that I had forgotten 
to include something in this git repo:
* Android manifest xml
* A list of Cordova plugins

I wish I had kept a tarball of the project before erasing it all .. :(  
The files were in these folders which are listed in .gitignore; 'platforms' and 'plugins'.

### Cordova plugins
I don't remember all plugins - I will try my best to reconstruct 
the list of Cordova plugins; I only used 'geolocation' actively
and had barely started to test out sqlite functionality.
* cordova-sqlite-storage
* cordova-plugin-geolocation
* croswalk http://plugins.telerik.com/cordova/plugin/crosswalk  
  Because webgl is not supported by default on all devices.

### Android manifest
The bash script `scripts/gulp_prod.sh` was run on the hook called 'before_prepare';
that was specified in the manifest.

I [jonas] remember that in order to make the `navigator.geolocation` work as expected, 
a few extra lines where needed in the manifest regarding location/position, e.g. about 
position precision.

## Steps to offline map tiles:
* Place mbtiles file on phone
* Use sqllite plugin to acces the file
* Change mapbox-gl-js to retrieve data from the mbtiles/sqllite file instead of with http.
Forking the code may be necessary, though not preferable.

Tiles for Bergen is in `www/data/mbtiles/bergen_norway.mbtiles`.
I got shell access to device but couldn't locate the file.
If you do, please let me know.

Make mapbox-gl-js read data from sqlite file .mbtiles instead 
through http requests. Example: https://github.com/trevorpowell/mapbox-gl-js-cordova-offline