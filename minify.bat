@echo off

cd scripts
forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map -o ../output/%%~I.js"

cd lms
forfiles /m *.js /c "cmd /q /c for %%I in (@fname) do terser %%~I.js --source-map -o ../../output/lms/%%~I.js"

cd ../..

echo done
