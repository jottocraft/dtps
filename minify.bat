@echo off

cmd /q /c terser init.js --source-map "url='/init.js.map'" -o ../v3.minified/init.js

cd scripts

forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map \"url='/scripts/%%~I.js.map',includeSources\" -o ../../v3.minified/scripts/%%~I.js"

cd lms

forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map \"url='/scripts/lms/%%~I.js.map',includeSources\" -o ../../../v3.minified/scripts/lms/%%~I.js"

cd ../..

echo done
