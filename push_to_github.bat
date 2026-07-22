@echo off
title Synchronisation GitHub - Plateforme RH Paprec
echo ========================================================
echo   SYNCHRONISATION ET MISE A JOUR AUTOMATIQUE SUR GITHUB
echo   Depot : https://github.com/Diblo40/paprec-rh-platform.git
echo ========================================================
echo.
cd /d "C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform"

echo 1. Enregistrement des dernieres modifications locales...
git add .
git commit -m "Mise a jour Plateforme RH Paprec - Solde conges et documents" >nul 2>&1

echo 2. Envoi vers GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCES ! Votre site a ete mis a jour sur GitHub !
    echo   Lien : https://github.com/Diblo40/paprec-rh-platform
    echo ========================================================
) else (
    echo.
    echo Une authentification GitHub est requise. 
    echo Veuillez valider la connexion dans la fenetre qui s'est ouverte.
)
echo.
pause
