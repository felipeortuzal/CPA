@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Atualizar CPA Study

if not exist .git (
  echo [ERRO] Esta pasta nao parece ser um clone Git do CPA.
  echo Faca a instalacao pelo README antes de usar este atualizador.
  pause
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Git nao foi encontrado no computador.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado. Instale Node.js 22 ou superior.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao foi encontrado.
  pause
  exit /b 1
)

set "DIRTY="
for /f "delims=" %%i in ('git status --porcelain') do set "DIRTY=1"
if defined DIRTY (
  echo.
  echo [ATENCAO] Existem arquivos locais modificados nesta pasta.
  echo O atualizador nao vai sobrescrever nada automaticamente.
  echo Resolva ou salve essas alteracoes manualmente e execute novamente.
  echo.
  git status --short
  pause
  exit /b 1
)

echo.
echo 1/2 - Baixando atualizacoes do GitHub com fast-forward seguro...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo [ERRO] A atualizacao Git falhou. Nenhum reset ou limpeza forcada foi executado.
  pause
  exit /b 1
)

echo.
echo 2/2 - Sincronizando dependencias...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo [ERRO] O codigo foi atualizado, mas npm install falhou.
  echo Rode npm install novamente quando a conexao estiver normal.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo   CPA atualizado com sucesso.
echo ==========================================
echo O progresso do navegador nao foi apagado.
echo Abra start-cpa.bat para estudar.
echo.
pause
exit /b 0
