# CodeMagic

CodeMagic is a development-stage coding-practice interface with curated problems, account registration, and local in-memory data.

## Important current limits

- The application deliberately **does not execute submitted code**. `Run` and `Submit` return an explicit unavailable response until an isolated, resource-limited judge worker is integrated. Executing untrusted code in the web server is unsafe.
- Data is in memory and is lost when the server restarts. The server refuses production startup until durable persistence and a real judge worker exist.
- Authentication uses a same-origin, HttpOnly session cookie and CSRF protection. Do not add browser-token storage back to the client.

## Development

1. Copy `.env.example` to `.env` and set a unique `JWT_SECRET` of at least 32 characters.
2. Install the locked dependencies and start the development server:

```bash
npm install
npm run dev
```

The development server starts on `http://0.0.0.0:3000`.

## Verification

```bash
npm run typecheck
npm test
npm run build
```
