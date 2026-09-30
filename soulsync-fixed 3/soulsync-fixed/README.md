# 🦋 SoulSync — Final Setup

## STEP 1 — Install MongoDB (one time only)
Download: https://www.mongodb.com/try/download/community
→ Windows → MSI → Install → CHECK "Install MongoDB as a Service"

## STEP 2 — Start Backend
Double-click: START-BACKEND.bat
Wait for:
  🦋 SoulSync Backend is RUNNING!
  🦋 Groq Key: SET

## STEP 3 — Start Frontend (NEW terminal window)
Double-click: START-FRONTEND.bat
Opens at: http://localhost:3000

## KEEP BOTH WINDOWS OPEN!

## If port 5001 is busy:
Run in terminal: npx kill-port 5001
Then run: node server.js again
