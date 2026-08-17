# BizPilot AI — Enterprise Security Threat Model

## Overview

This document outlines the threat vectors, risk assessments, and mitigation controls for **BizPilot AI**, an AI-powered Company Operating System.

---

## Threat Matrix & Mitigation Controls

| # | Threat Vector | Risk Level | Mitigation Control Implemented in BizPilot AI |
| :- | :--- | :--- | :--- |
| **1** | **Unauthorized User Access** | CRITICAL | Mandatory JWT bearer token validation on all protected endpoints (`get_current_user`). |
| **2** | **Compromised User Account** | HIGH | Bcrypt/Argon2 password hashing, short-lived JWT expiration (1h), rate-limited login endpoints. |
| **3** | **Cross-Tenant Data Leakage** | CRITICAL | Mandatory `company_id` scoping on 100% of PostgreSQL queries, raw storage directories, and AI context. |
| **4** | **Malicious File Upload** | HIGH | File signature magic byte validation (%PDF, PK\x03\x04), extension whitelist, 50MB size limit. No file execution. |
| **5** | **Path Traversal Attack** | CRITICAL | Filename sanitization (`sanitize_filename`), isolated path validation (`RawStorage.get_ingestion_dir`). |
| **6** | **SQL Injection** | CRITICAL | Parameterized queries via SQLAlchemy ORM & `text(:params)` syntax. Zero raw string concatenation. |
| **7** | **Broken Object-Level Auth (BOLA/IDOR)** | CRITICAL | Strict tenant ID ownership checks before returning or mutating entity resources (`entity.company_id == current_user.company_id`). |
| **8** | **Token Theft / Misuse** | HIGH | HTTPS transport requirement, token expiration, secret key rotation, no sensitive payload claims. |
| **9** | **Privilege Escalation** | CRITICAL | Server-side RBAC permission matrix enforcement (`require_permission`, `ROLE_PERMISSIONS`). Frontend rules not trusted. |
| **10** | **Sensitive Data Leakage in Logs** | HIGH | Automatic log redaction (`redact_sensitive_dict`) stripping passwords, tokens, JWTs, auth headers. |
| **11** | **Prompt Injection (Document-based)** | HIGH | Document content treated strictly as untrusted data context. System instructions prioritize application policy. |
| **12** | **API Abuse & Excessive Requests** | MEDIUM | Sliding window rate limiting middleware (`RateLimiter` 300 req/min, 10 login req/min). |
| **13** | **Data Deletion Abuse** | HIGH | Role-controlled deletion permissions (`invoices.delete`, `ingestion.delete`), soft deletion patterns. |
| **14** | **Insider Misuse** | MEDIUM | Immutable PostgreSQL audit log (`AuditLog`) recording user, action, resource, IP, user-agent, timestamp. |
| **15** | **Insecure Third-Party Integrations** | MEDIUM | Strict connector status indicators (`CONNECTED`, `DEV CONNECTOR`, `COMING SOON`). Zero fake connected states. |
| **16** | **LLM Context Leakage** | CRITICAL | Role-based context minimizer (`minimize_ai_context`). Non-finance users blocked from receiving bank context. |
| **17** | **Cross-Site Scripting (XSS)** | MEDIUM | `X-XSS-Protection: 1; mode=block`, `Content-Security-Policy` headers, React auto-escaping. |
| **18** | **Clickjacking Attacks** | MEDIUM | `X-Frame-Options: DENY` response header on all HTTP responses. |
| **19** | **MIME Sniffing Vulnerability** | LOW | `X-Content-Type-Options: nosniff` header enforced on all API responses. |
| **20** | **Credential Exposure in Git** | CRITICAL | Environment variable configuration (`.env.example`), `.gitignore` enforcement, secret scanning validation. |
