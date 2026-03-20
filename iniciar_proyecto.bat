@echo off
title Lanzador ReservaHub - UPQ

:: 1. Lanzar el Backend en una ventana nueva
:: Nota: Usamos /D para forzar el directorio de inicio antes de ejecutar nada
start "Backend FastAPI" /D "C:\GitHub\ReservasPI\BackendReserva" cmd /k "call .\venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

:: 2. Lanzar el Frontend en esta ventana
echo Iniciando React Native en 192.168.100.95...
cd /d "C:\GitHub\ReservasPI\ProyectoIntegrador"
npx expo start -c