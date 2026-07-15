@echo off
chcp 65001 >nul
title Questionnaire MASI - Serveur local
cd /d "%~dp0"

echo ============================================================
echo   Questionnaire MASI - demarrage du site
echo ============================================================
echo.

rem --- Verifie que Node.js est installe ---
where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe sur cet ordinateur.
  echo.
  echo   1. Allez sur https://nodejs.org
  echo   2. Telechargez la version "LTS" et installez-la
  echo   3. Relancez ce fichier (double-clic)
  echo.
  pause
  exit /b
)

rem --- Installe les dependances a la premiere utilisation ---
if not exist node_modules (
  echo Premiere utilisation : installation des composants...
  echo (cela peut prendre 1 a 2 minutes, une seule fois)
  echo.
  call npm install
  echo.
)

echo Le site va s'ouvrir dans votre navigateur.
echo.
echo   * Adresse du questionnaire : http://localhost:5173
echo   * Tableau de bord chercheur : http://localhost:5173/#tableau-de-bord
echo.
echo   Pour ARRETER le site : fermez simplement cette fenetre noire.
echo ============================================================
echo.

call npm run dev

pause
