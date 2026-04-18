@echo off
title DBD Skillcheck Simulator - Rebuild Dist
cd /d "%~dp0"

echo.
echo Deleting old dist folder...
if exist dist rmdir /s /q dist

echo.
echo Building production dist...
call npm run build

echo.
echo Done.
pause