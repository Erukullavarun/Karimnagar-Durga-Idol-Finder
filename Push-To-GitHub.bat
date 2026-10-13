@echo off
title Push Karimnagar Durga Idol Finder to GitHub
echo ========================================================
echo Pushing latest code to GitHub repository...
echo https://github.com/ErukullaVarun/Karimnagar-Durga-Idol-Finder
echo ========================================================
cd /d "C:\Users\chint\Desktop\karimnagar-durga-manual-github-upload"
git push -u origin main --force
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS: Project pushed to GitHub!
    echo Now open Render dashboard to deploy.
    echo ========================================================
) else (
    echo ========================================================
    echo Push encountered an issue. Please sign in to GitHub if prompted.
    echo ========================================================
)
pause
