@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: ============================================================
:: ai-maintenance-skills 一键发布脚本
:: 防止误发布：只允许发布到 canglei9527/ai-maintenance-skills
:: 用法：双击运行，或 release.bat [版本号] [标题]
:: ============================================================

set "REPO_DIR=%~dp0"
set "REQUIRED_REMOTE=https://github.com/canglei9527/ai-maintenance-skills.git"
set "REQUIRED_REMOTE_SSH=git@github.com:canglei9527/ai-maintenance-skills.git"

echo.
echo ========================================
echo  ai-maintenance-skills 发布工具
echo ========================================
echo.

:: 切换到仓库目录
cd /d "%REPO_DIR%"
if errorlevel 1 (
    echo [错误] 无法切换到仓库目录: %REPO_DIR%
    pause & exit /b 1
)

:: ── 检查 node 是否存在 ──────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 node，请先安装 Node.js
    pause & exit /b 1
)

:: ── 检查 git 是否存在 ──────────────────────────────────────
where git >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 git
    pause & exit /b 1
)

:: ── 防误发布：校验 remote origin ────────────────────────────
for /f "tokens=*" %%R in ('git remote get-url origin 2^>nul') do set "CURRENT_REMOTE=%%R"
if "!CURRENT_REMOTE!"=="" (
    echo [错误] 没有找到 git remote origin
    echo 请确认你在正确的仓库目录中运行此脚本。
    pause & exit /b 1
)

if /i "!CURRENT_REMOTE!"=="!REQUIRED_REMOTE!" goto :remote_ok
if /i "!CURRENT_REMOTE!"=="!REQUIRED_REMOTE_SSH!" goto :remote_ok

echo [错误] 仓库校验失败！禁止发布！
echo.
echo   当前 remote : !CURRENT_REMOTE!
echo   要求发布到  : %REQUIRED_REMOTE%
echo.
echo 你可能在错误的目录下运行了此脚本（例如 GLM5.2）。
echo 请切换到 ai-maintenance-skills-release 目录再运行。
pause & exit /b 1

:remote_ok
echo [OK] 仓库校验通过: !CURRENT_REMOTE!
echo.

:: ── 读取版本号 ──────────────────────────────────────────────
if not "%~1"=="" (
    set "VERSION=%~1"
) else (
    set /p "VERSION=请输入新版本号（如 0.4.4）: "
)
if "!VERSION!"=="" (
    echo [错误] 版本号不能为空
    pause & exit /b 1
)

:: ── 读取发布标题 ────────────────────────────────────────────
if not "%~2"=="" (
    set "TITLE=%~2"
) else (
    set /p "TITLE=请输入发布标题（一句话描述本次变更）: "
)
if "!TITLE!"=="" (
    echo [错误] 发布标题不能为空
    pause & exit /b 1
)

:: ── 读取发布说明 ────────────────────────────────────────────
echo.
echo 请输入发布说明（每行一条变更，输入空行结束）:
set "NOTES="
set "LINE_NUM=0"
:notes_loop
set /p "NOTE_LINE=  > "
if "!NOTE_LINE!"=="" goto :notes_done
if "!NOTES!"=="" (
    set "NOTES=!NOTE_LINE!"
) else (
    set "NOTES=!NOTES!\n!NOTE_LINE!"
)
set /p "NOTE_LINE=  > " <con
goto :notes_loop
:notes_done

if "!NOTES!"=="" (
    echo [错误] 发布说明不能为空
    pause & exit /b 1
)

:: ── 确认发布信息 ────────────────────────────────────────────
echo.
echo ----------------------------------------
echo  即将发布：
echo    版本: v!VERSION!
echo    标题: !TITLE!
echo    仓库: !CURRENT_REMOTE!
echo ----------------------------------------
echo.
set /p "CONFIRM=确认发布？输入 yes 继续，其他任意键取消: "
if /i not "!CONFIRM!"=="yes" (
    echo 已取消发布。
    pause & exit /b 0
)

:: ── 执行发布 ────────────────────────────────────────────────
echo.
echo [运行] node scripts/release.mjs --publish --yes --version !VERSION! --title "!TITLE!" --notes "!NOTES!"
echo.

node scripts/release.mjs ^
  --publish --yes ^
  --version "!VERSION!" ^
  --title "!TITLE!" ^
  --notes "!NOTES!"

if errorlevel 1 (
    echo.
    echo [失败] 发布过程中出现错误，请检查上方输出。
    pause & exit /b 1
)

echo.
echo [成功] v!VERSION! 已发布到 https://github.com/canglei9527/ai-maintenance-skills
echo.
pause
