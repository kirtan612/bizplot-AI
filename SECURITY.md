# BizPilot AI — Enterprise Security Specification

## Security Overview

BizPilot AI enforces a strict **DENY BY DEFAULT** enterprise security model across all architecture layers: API authentication, Role-Based Access Control (RBAC), multi-tenant data isolation, raw file storage, database queries, and AI executive context boundaries.

---

## 1. Authentication & JWT Hardening

- **Password Hashing**: Passwords are hashed using Bcrypt / Argon2 via `passlib`. Plaintext passwords are never stored or logged.
- **JWT Tokens**: Signed with `HS256`, 1-hour expiration (`exp`), issued with `iat` and user claims (`user_id`, `company_id`, `role`).
- **Generic Auth Errors**: Login failures return generic messaging (`Invalid username or password`) to prevent account enumeration.

---

## 2. Multi-Tenant Organization Isolation

- **Tenant Scoping**: 100% of PostgreSQL entities (`Company`, `Customer`, `Supplier`, `Product`, `Order`, `Invoice`, `Payment`, `Expense`, `BankTransaction`, `TaxRecord`, `Document`, `Ingestion`, `NormalizationJob`, `ExecutiveMeeting`, `AuditLog`) are explicitly bound by `company_id`.
- **Tenant Validation**: The backend extracts `company_id` directly from the authenticated JWT token claim — user-supplied `company_id` parameters in request bodies are ignored.
- **BOLA / IDOR Protection**: Object lookup routines verify `entity.company_id == current_user.company_id` before returning or mutating data. Unauthorized cross-tenant access returns `403 Forbidden` or `404 Not Found`.

---

## 3. Role-Based Access Control (RBAC) & Permission Matrix

| Resource / Endpoint | Owner | Admin | Finance | Operations | Marketing | Employee | Viewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Invoices & Payments** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | Read |
| **Bank Transactions** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Inventory & Purchases** | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | Read |
| **Customers & Sales** | ✓ | ✓ | ✓ | ✓ | ✓ | Read | Read |
| **AI CFO Executive** | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **AI COO Executive** | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| **AI CMO Executive** | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Audit Logs** | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## 4. Data Classification & Protection

- **PUBLIC**: Non-sensitive branding, static assets.
- **INTERNAL**: Products, SKU lists, general operational metadata.
- **CONFIDENTIAL**: Invoices, Orders, Customer lists, Sales registers.
- **RESTRICTED**: Bank transactions, Tax records, Auth credentials, Executive decisions.

---

## 5. Raw File Storage & Security

- **Path Traversal Protection**: Filenames are sanitized via `sanitize_filename` (strips directories, enforces alphanumeric chars).
- **Tenant Storage Isolation**: Files stored at `storage/raw/{company_id}/{ingestion_id}/{safe_filename}`.
- **File Validation**: Extension whitelist (`.xlsx`, `.xls`, `.csv`, `.pdf`), magic byte signature checking (`%PDF`, `PK\x03\x04`), 50MB max upload size limit.
- **No File Execution**: Uploaded files are parsed in memory and never executed.

---

## 6. Audit Logging & Sensitive Log Redaction

- **AuditLog Entity**: Records `company_id`, `user_id`, `username`, `action`, `resource_type`, `resource_id`, `status`, `ip_address`, `user_agent`, `timestamp`.
- **Log Redaction**: `redact_sensitive_dict` automatically redacts passwords, JWT tokens, authorization headers, and secrets before writing to logs.

---

## 7. AI Executive Context Security & Minimization

- **Tenant Scoping**: AI Executive context builders query strictly by `current_user.company_id`.
- **Role Scoping**: Non-finance roles are blocked from receiving raw bank transaction context in LLM prompts.
- **Context Minimization**: Raw database dumps are never passed to the LLM — only structured, authorized metrics are provided.

---

## 8. Network & API Security

- **CORS Configuration**: Configurable trusted origins in production.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`.
- **Rate Limiting**: Sliding window rate limiting on API endpoints (10 login req/min, 300 API req/min).

---

## 9. Incident Response Foundation

1. **Detect**: Monitor audit logs for unusual authentication or authorization failures.
2. **Contain**: Deactivate user account or revoke JWT secret if credentials are compromised.
3. **Investigate**: Trace incident via `audit_logs` entries.
4. **Recover & Document**: Rotate credentials, document incident, notify organization administrators.

---

## 10. Known Limitations

- Production HTTPS TLS termination is expected to be handled by the deployment reverse proxy / load balancer (e.g. Nginx / Traefik / AWS ALB).
- External immutable tamper-proof WORM storage for audit logs is not enabled in local dev environment.
