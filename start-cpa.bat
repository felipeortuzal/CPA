@echo off
setlocal
cd /d "%~dp0"
title CPA Study

if not exist package.json (
  echo [ERRO] package.json nao encontrado. Execute este arquivo dentro da pasta CPA.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado.
  echo Instale o Node.js 22 ou superior e tente novamente.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao foi encontrado. Reinstale o Node.js 22 ou superior.
  pause
  exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%v"
if %NODE_MAJOR% LSS 22 (
  echo [ERRO] Node.js %NODE_MAJOR% detectado. O CPA usa Node.js 22 ou superior.
  pause
  exit /b 1
)

if not exist node_modules (
  echo.
  echo Primeira execucao: instalando dependencias...
  call npm install --no-audit --no-fund --no-package-lock
  if errorlevel 1 (
    echo.
    echo [ERRO] Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)

echo.
echo ==========================================
echo   CPA Study
echo ==========================================
echo O navegador sera aberto automaticamente.
echo Para encerrar, volte a esta janela e use Ctrl+C.
echo Seu progresso fica salvo no navegador local.
echo.

call npm run dev -- --open
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
  echo.
  echo [ERRO] O servidor foi encerrado com codigo %EXIT_CODE%.
  pause
)
exit /b %EXIT_CODE%
