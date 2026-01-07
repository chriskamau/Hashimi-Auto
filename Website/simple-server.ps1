# Simple HTTP Server - Hashimi Auto Solutions
$port = 8000
$url = "http://localhost:$port/"

Write-Host "Starting server on $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start browser
Start-Process $url

# Simple HTTP server using .NET HttpListener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Server running! Open: $url" -ForegroundColor Green
Write-Host ""

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }
    
    $filePath = Join-Path (Get-Location) $localPath.TrimStart('/')
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        $contentType = @{
            ".html" = "text/html; charset=utf-8"
            ".css" = "text/css; charset=utf-8"
            ".js" = "application/javascript; charset=utf-8"
            ".json" = "application/json; charset=utf-8"
            ".png" = "image/png"
            ".jpg" = "image/jpeg"
            ".jpeg" = "image/jpeg"
            ".gif" = "image/gif"
            ".svg" = "image/svg+xml"
            ".ico" = "image/x-icon"
            ".xml" = "application/xml"
            ".txt" = "text/plain"
        }
        
        $response.ContentType = if ($contentType.ContainsKey($ext)) { $contentType[$ext] } else { "application/octet-stream" }
        $response.StatusCode = 200
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p><a href='/'>Go Home</a></p>")
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    
    $response.Close()
}
