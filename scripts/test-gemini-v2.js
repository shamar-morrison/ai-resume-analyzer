const fs = require('fs')
const path = require('path')
const https = require('https')

// Load environment variables from .env.local manually
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local')
    if (!fs.existsSync(envPath)) return null
    const content = fs.readFileSync(envPath, 'utf8')
    const matches = content.match(/GEMINI_API_KEY=(.*)/)
    return matches && matches[1] ? matches[1].trim() : null
  } catch (err) {
    return null
  }
}

const API_KEY = loadEnv()
if (!API_KEY) process.exit(1)

async function testModel(modelName) {
  console.log(`\n--- Testing Model: ${modelName} ---`)

  const data = JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }],
  })

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS (${res.statusCode})`)
        } else {
          console.log(`❌ FAILED (${res.statusCode})`)
          console.log('Error Body:', body)
        }
        resolve()
      })
    })
    req.write(data)
    req.end()
  })
}

testModel('gemini-flash-lite-latest')
