# Lumenscope

A web-based accessibility audit dashboard. Paste any public URL, traverse its DOM using a secure proxy, and generate a scored WCAG compliance report with visual highlights.

## Design Concept: "Diagnostic Instrument"
Lumenscope is designed as a precise clinical tool: high contrast, clear information hierarchy, minimal decoration, and fully accessible color pairings throughout its own interface.

---

## Architecture & Data Flow
Lumenscope is structured as a monorepo consisting of:
1. **Client SPA** (React + TypeScript + Vite 8 + Tailwind CSS v4)
2. **Backend Proxy** (Express 4)

```
┌──────────────────────────────────────────────────────────┐
│              CLIENT — React SPA (Vite 8)                 │
│                                                          │
│  URL input → score dashboard → violation cards           │
│  axe-core injection runs HERE, in-browser, on iframe DOM  │
└─────────────────────┬──────────────────────────────────── ┘
                      │ HTTPS GET /api/fetch?url=...
                      ▼
┌──────────────────────────────────────────────────────────┐
│           BACKEND — Express 4 Proxy                      │
│                                                          │
│  → Fetch target HTML with Node built-in fetch()           │
│  → Strip all <script> tags (security mitigation)          │
│  → Return sanitized HTML string to client                  │
└──────────────────────────────────────────────────────────┘
```

### Key Technical Decisions
* **Client-side axe execution**: Running axe-core server-side requires Puppeteer/headless browsers, which are resource-heavy and expensive. Running axe client-side inside a same-origin `srcdoc` iframe is highly efficient.
* **Backend HTML proxying**: Browsers restrict cross-origin requests. The proxy retrieves target HTML and serves it same-origin, making iframe DOM injection and axe-core analysis possible.

---

## Known Limitations

1. **SPA Target Limits**: Because the proxy fetches server-rendered raw HTML, heavily dynamic single-page applications that construct their DOM exclusively client-side via JavaScript may return incomplete or near-empty scan results.
2. **Proxy-Blocked Sites**: Websites protected by aggressive anti-bot features, CAPTCHAs, or Cloudflare verification block raw node fetch requests, preventing analysis.
3. **Same-Origin Content Trade-offs**: Same-origin DOM access is required for in-browser axe evaluations. Staging raw HTML inside standard iframes without sandbox isolation makes DOM parsing possible but is limited to non-executing static content.

---

## Setup & Running Locally

### Prerequisites
* Node.js v20.19+ or v22.12+

### Installation
From the root directory, run:
```bash
npm install --legacy-peer-deps
```

### Run Development Servers
Start both the Vite client server and the Express proxy server concurrently:
```bash
npm run dev
```
* **Client Frontend**: `http://localhost:5173`
* **Proxy Backend**: `http://localhost:3001`