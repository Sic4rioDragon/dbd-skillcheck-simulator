@echo off
title DBD Skillcheck Simulator - Local Dev
cd /d "%~dp0"
echo Starting local dev server...
call npm run serve
pause