# Script de API Client para Backend1
$API_URL = "http://localhost:3000"
$TOKEN = "123ABC"

function Get-ProjectInfo {
    Write-Host "-> Obteniendo info del proyecto..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$API_URL/" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}

function Login-Hidden {
    param([string]$Name = "admin", [string]$Password = "admin123")
    Write-Host "-> Realizando login..." -ForegroundColor Yellow
    $body = @{name=$Name;password=$Password} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/hidden-login" -Method POST -Body $body -ContentType "application/json"
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}

function Get-AllProducts {
    Write-Host "-> Obteniendo todos los productos..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$API_URL/api/products" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "Productos encontrados: $($products.Count)" -ForegroundColor Green
    $products.value | ForEach-Object {
        Write-Host "  ID: $($_.id) | Nombre: $($_.nombre) | Precio: $($_.precio)" -ForegroundColor Gray
    }
}

function Get-ProductById {
    param([int]$Id)
    Write-Host "-> Buscando producto $Id..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "$API_URL/api/products/$Id" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}

function New-Product {
    param([string]$Nombre, [int]$Precio, [string]$AuthToken = $TOKEN)
    Write-Host "-> Creando producto..." -ForegroundColor Cyan
    $body = @{nombre=$Nombre;precio=$Precio} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$API_URL/api/products" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization"=$AuthToken}
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}

function Test-Token {
    param([string]$Token = $TOKEN)
    Write-Host "-> Validando token..." -ForegroundColor Cyan
    $body = @{token=$Token} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/validate-token" -Method POST -Body $body -ContentType "application/json"
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BACKEND1 API CLIENT CARGADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Funciones disponibles:" -ForegroundColor Yellow
Write-Host "  Get-ProjectInfo"
Write-Host "  Login-Hidden"
Write-Host "  Get-AllProducts"
Write-Host "  Get-ProductById -Id 1"
Write-Host "  New-Product -Nombre 'Laptop' -Precio 999"
Write-Host "  Test-Token"
Write-Host ""
Write-Host "API: $API_URL | Token: $TOKEN" -ForegroundColor Gray
Write-Host ""
