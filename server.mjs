import http from 'http'

const PORT = 5175

// In-memory stores for prototype
const PROJECTS = []
const EXPERIMENTS = {} // projectId -> [experiments]

function sendJSON(res, status, obj) {
  const payload = JSON.stringify(obj)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(payload)
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      let payload = {}
      try {
        payload = body ? JSON.parse(body) : {}
      } catch (e) {
        // ignore
      }

      // simulate a small processing delay
      setTimeout(() => {
        const demo = {
          project: payload,
          metrics: {
            capacity: '1,420 kN',
            cost: '$1.38M',
            safety: '1.42',
          },
          logs: [
            { time: new Date().toISOString(), title: 'Agent A started evaluation', color: 'blue', rationale: 'Initializing evaluation' },
            { time: new Date().toISOString(), title: 'Agent B suggested mix', color: 'orange', rationale: 'Candidate material mix proposed' },
          ],
        }

        sendJSON(res, 200, demo)
      }, 700)
    })

    return
  }

  // Projects API (simple in-memory for prototype)
  if (req.url && req.url.startsWith('/api/projects')) {
    const parts = req.url.split('/').filter(Boolean) // ['api','projects',':id',...]
    // GET /api/projects
    if (req.method === 'GET' && parts.length === 2) {
      return sendJSON(res, 200, { projects: PROJECTS })
    }

    // POST /api/projects -> create project
    if (req.method === 'POST' && parts.length === 2) {
      let body = ''
      req.on('data', (c) => (body += c))
      req.on('end', () => {
        let payload = {}
        try {
          payload = body ? JSON.parse(body) : {}
        } catch (e) {}
        const id = `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const proj = { id, createdAt: new Date().toISOString(), ...payload }
        PROJECTS.push(proj)
        EXPERIMENTS[id] = []
        return sendJSON(res, 201, proj)
      })
      return
    }

    // GET /api/projects/:id
    if (req.method === 'GET' && parts.length === 3) {
      const id = parts[2]
      const proj = PROJECTS.find((p) => p.id === id)
      if (!proj) return sendJSON(res, 404, { error: 'Project not found' })
      return sendJSON(res, 200, proj)
    }

    // POST /api/projects/:id/experiments -> run a mock experiment and return results (blocking short sim)
    if (req.method === 'POST' && parts.length === 4 && parts[3] === 'experiments') {
      const id = parts[2]
      let body = ''
      req.on('data', (c) => (body += c))
      req.on('end', () => {
        let payload = {}
        try {
          payload = body ? JSON.parse(body) : {}
        } catch (e) {}

        const expId = `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        const exp = { id: expId, projectId: id, params: payload.params || {}, status: 'running', startedAt: new Date().toISOString() }
        EXPERIMENTS[id] = EXPERIMENTS[id] || []
        EXPERIMENTS[id].push(exp)

        // simulate processing time and produce deterministic-ish metrics
        setTimeout(() => {
          const metrics = {
            capacity: `${1000 + Math.floor(Math.random() * 600)} kN`,
            cost: `$${(0.8 + Math.random() * 1.6).toFixed(2)}M`,
            safety: (1.1 + Math.random() * 0.8).toFixed(2),
          }
          exp.status = 'complete'
          exp.finishedAt = new Date().toISOString()
          exp.metrics = metrics
        }, 900)

        // wait slightly longer than worker to return final metrics so client gets result directly (prototype)
        setTimeout(() => {
          const stored = EXPERIMENTS[id].find((e) => e.id === expId)
          return sendJSON(res, 200, stored || exp)
        }, 1200)
      })
      return
    }
  }

  // default: 404
  sendJSON(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  // Informational log
  // eslint-disable-next-line no-console
  console.log(`Mock API server listening on http://localhost:${PORT}`)
})
