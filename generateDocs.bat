@echo off

echo Generating DTPS Reference docs...
call jsdoc2md scripts/*.js -c ./docs/jsdoc.conf.json --separators > docs/docs/reference.md
echo --- > temp.txt
echo id: reference >> temp.txt
echo title: Reference >> temp.txt
echo --- >> temp.txt
echo Generated on %date% >> temp.txt
echo. >> temp.txt
echo Reference documentation is also available in [JSDoc format](/jsdoc/index.html) >> temp.txt
cd docs
cd docs
type reference.md >> ../../temp.txt
cd ../../
type temp.txt > docs/docs/reference.md
del temp.txt
powershell -Command "(gc docs/docs/reference.md) -replace '<code>', '<monospace>' | Out-File -encoding ASCII docs/docs/reference.md"
powershell -Command "(gc docs/docs/reference.md) -replace '</code>', '</monospace>' | Out-File -encoding ASCII docs/docs/reference.md"

echo Generating DTPS JSDoc files...
call jsdoc scripts -p -d ./docs/static/jsdoc -c ./docs/jsdoc.conf.json
