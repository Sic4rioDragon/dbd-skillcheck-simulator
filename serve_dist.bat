@echo off
title DBD Skillcheck Simulator - Serve Dist
cd /d "%~dp0\dist"

echo Serving built dist at http://localhost:8081
python -m http.server 8081
pause