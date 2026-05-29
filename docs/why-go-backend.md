# CentralApp - Technical Decision: Go Backend

## Why Go (Golang) for Backend?

### Server Constraints
- **Server**: Non-production / Development server (RAITPIAAPPDEV)
- **RAM**: 4GB only
- **Purpose**: Development and testing environment

### Problem with Previous Setup (Node.js Backend)
Based on the previous project (PIA) running on the same infrastructure:

| Metric | Node.js (PIA_Backend) | Go (CentralApp Backend) |
|--------|----------------------|------------------------|
| Memory Usage | ~129.9mb + 78mb | ~8.8mb |
| Restart Count (crashes) | 36 | 0 |
| Stability | Frequent restarts | Stable |

**Node.js backend consumed approximately 200mb+ of RAM** — nearly 5% of total server memory for a single backend process alone.

### Why Go is Better for This Environment
1. **Memory Efficient** — ~20x less memory usage compared to Node.js backend
2. **Compiled Binary** — No runtime overhead, no V8 engine, no node_modules in production
3. **Stable** — No unexpected crashes or memory leaks
4. **Fast** — Compiled language, faster execution
5. **Suitable for 4GB RAM** — Leaves more resources for other services (Nginx, PostgreSQL, Frontend)

### Current Architecture
```
Nginx (port 443) → Frontend: Next.js (port 3001) + Backend: Go (port 3000)
```

- **Frontend**: Next.js (TypeScript/React) — chosen for auto cache-busting, SSR, and modern UI
- **Backend**: Go — chosen for performance and low memory footprint
- **Database**: PostgreSQL
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx with SSL

### Conclusion
Given the 4GB RAM limitation of the development server, Go was selected as the backend language to maximize available resources while maintaining performance and stability. The previous Node.js backend demonstrated high memory consumption and instability (36 restarts), making it unsuitable for this constrained environment.
