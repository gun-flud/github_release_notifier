Write-Host "🚀 Starting Full API Mock Test Suite..." -ForegroundColor Cyan

# --- TEST 1: BAD FORMAT ---
Write-Host "`n[Test 1] Testing Bad JSON Format (Expected 400 Bad Request)" -ForegroundColor Yellow
curl.exe -s -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"repo\":\"badformat\"}'

# --- TEST 2: FAKE REPO ---
Write-Host "`n`n[Test 2] Testing Fake Repository (Expected 404 Not Found)" -ForegroundColor Yellow
curl.exe -s -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"repo\":\"owner/xyznotreal\"}'

# --- TEST 3: HAPPY PATH ---
Write-Host "`n`n[Test 3] Testing Valid Subscription (Expected 201 Created)" -ForegroundColor Yellow
curl.exe -s -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"repo\":\"node-cron/node-cron\"}'

# --- PAUSE FOR EMAIL ---
Write-Host "`n`n📧 Check http://localhost:8025 for the confirmation email." -ForegroundColor Magenta
$confirmToken = Read-Host "📝 Paste the CONFIRMATION token from the email here and press Enter"

# --- TEST 4: CONFIRM ---
Write-Host "`n[Test 4] Confirming Subscription (Expected 200 OK)" -ForegroundColor Yellow
curl.exe -s "http://localhost:3000/api/confirm/$confirmToken"

# --- TEST 5: LIST ---
Write-Host "`n`n[Test 5] Fetching Subscriptions for test@example.com (Expected Array with node-cron/node-cron)" -ForegroundColor Yellow
curl.exe -s "http://localhost:3000/api/subscriptions?email=test@example.com"

# --- PAUSE FOR UNSUBSCRIBE ---
Write-Host "`n`n📧 Grab the UNSUBSCRIBE token from that same email." -ForegroundColor Magenta
$unsubToken = Read-Host "📝 Paste the UNSUBSCRIBE token here and press Enter"

# --- TEST 6: UNSUBSCRIBE ---
Write-Host "`n[Test 6] Unsubscribing (Expected 200 OK)" -ForegroundColor Yellow
curl.exe -s "http://localhost:3000/api/unsubscribe/$unsubToken"

Write-Host "`n`n✅ Full API Test Suite Complete!" -ForegroundColor Green