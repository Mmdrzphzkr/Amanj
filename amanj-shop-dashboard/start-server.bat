@echo off
echo ========================================
echo Starting Amanj Shop Dashboard Service
echo ========================================
echo.

:: تغییر به دایرکتوری پروژه (برای اطمینان)
cd /d "C:\Amanj\localfile\AmanjShop\amanj-shop-dashboard"

:: ۱. کپی فایل‌های استاتیک
echo [1/3] Copying .next\static to standalone...
xcopy ".next\static" ".next\standalone\.next\static\" /E /I /Y
if %errorlevel% neq 0 (
    echo Warning: Failed to copy .next\static
)

:: ۲. کپی فایل‌های public
echo [2/3] Copying public to standalone...
xcopy "public" ".next\standalone\public\" /E /I /Y
if %errorlevel% neq 0 (
    echo Warning: Failed to copy public
)

:: ۳. اجرای سرور Next.js
echo [3/3] Starting Next.js server...
echo.
echo Server is running at: http://localhost:3000
echo.

node .next/standalone/server.js