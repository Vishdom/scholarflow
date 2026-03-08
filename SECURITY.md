# Security Policy

## Reporting a Vulnerability

**Please DO NOT create a public issue for security vulnerabilities.**

Instead, email security@scholarflow.dev with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

We will acknowledge receipt within 24 hours and aim to release a fix within 7 days.

## Supported Versions

| Version | Status       | Security Updates |
|---------|--------------|------------------|
| 1.x     | Current      | Yes              |
| 0.x     | Deprecated   | No               |

## Security Features

- Environment variable validation
- Input sanitization
- XSS protection
- CORS configuration
- Row-level security (Supabase)
- Parameterized queries

## Best Practices

1. Keep dependencies updated
2. Never commit secrets
3. Use HTTPS in production
4. Enable RLS in database
5. Validate all user inputs
6. Regular security audits

## Dependencies

We use:
- npm audit for dependency scanning
- Snyk for vulnerability detection
- GitHub security alerts

---

**Questions?** Contact security@scholarflow.dev
