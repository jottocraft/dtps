@echo off

echo.
echo Minifying JavaScript...

call terser init.js --source-map "url='/init.js.map'" -o ../v3.minified/init.js

cd scripts

forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map \"url='/scripts/%%~I.js.map',includeSources\" -o ../../v3.minified/scripts/%%~I.js"

cd lms

forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map \"url='/scripts/lms/%%~I.js.map',includeSources\" -o ../../../v3.minified/scripts/lms/%%~I.js"

cd ../..

echo.
echo Copying CSS for distribution...

call copy dtps.css ..\v3.minified\dtps.css

echo.
echo Generating JSDoc Documentation...

call jsdoc -r scripts -d ../v3.minified/docs -c ./docs/jsdoc.conf.json -t %APPDATA%\npm\node_modules\foodoc\template -R docs\README.md

echo.
echo Done

pause