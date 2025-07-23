@echo off
REM Crea la cartella principale
mkdir bubble-tea-frontend
cd bubble-tea-frontend

REM File HTML principali
echo.> index.html
echo.> menu.html
echo.> custom.html
echo.> dolci.html
echo.> carrello.html

REM Cartella admin + file
mkdir admin
cd admin
echo.> login.html
echo.> dashboard.html
echo.> prodotti.html
echo.> statistiche.html
cd..

REM Cartella CSS + file
mkdir css
cd css
echo.> styles.css
echo.> home.css
echo.> animations.css
echo.> menu.css
echo.> custom.css
echo.> carrello.css
echo.> admin.css
cd..

REM Cartella JS + sottocartelle + file
mkdir js
cd js
mkdir lib
cd lib
echo.> jsQR.js
cd..

mkdir modules
cd modules
echo.> bubbles-animation.js
echo.> qr-scanner.js
cd..

echo.> main.js
cd..

REM Cartella assets + sottocartelle + file
mkdir assets
cd assets

mkdir bubbles
cd bubbles
echo.> bubble1.svg
echo.> bubble2.svg
echo.> bubble3.svg
cd..

mkdir icons
cd icons
echo.> bubble-tea.svg
echo.> instagram.svg
echo.> facebook.svg
echo.> tiktok.svg
cd..

mkdir products
cd products
echo.> drink1.jpg
echo.> drink2.jpg
echo.> drink3.jpg
echo.> drink4.jpg
echo.> drink5.jpg
cd..
cd..
cd..

echo Struttura del progetto creata con successo!
pause
