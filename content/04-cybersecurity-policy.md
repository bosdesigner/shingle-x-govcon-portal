# Information Safeguarding Policy — Shingle X LLC

Shingle X protects federal contract information (FCI) on every system it uses, under the 15 basic safeguarding requirements of FAR 52.204-21, renumbered [52.240-93](https://www.summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020) under the FAR overhaul. FCI is any non-public information the government provides or we generate under a contract: orders, delivery schedules, pricing correspondence, VA facility contacts. Owner: Ben Strout, CIO. Effective \[date\].

## 1. Scope

- Systems in scope: Google Workspace / Microsoft 365 \[pick one\] email and file storage, laptops and phones used for government work, the accounting system, and the order and shipping system.
- We do **not** take Controlled Unclassified Information (CUI) or patient data in normal sales. If a VA pilot or contract would give us patient-identifiable data, stop and route it to the CIO. That needs a VA data-use agreement and HIPAA controls, and it is out of scope for this policy.
- DoD/DLA work: these 15 controls equal CMMC Level 1. File the annual Level 1 self-assessment in SPRS before bidding any DoD contract that requires it.

## 2. The 15 controls and how we meet them

| # | Requirement | How Shingle X meets it | Evidence |
| --- | --- | --- | --- |
| 1 | Limit system access to authorized users, processes and devices | Named accounts only, no shared logins; accounts removed the day someone leaves | User list, offboarding checklist |
| 2 | Limit users to the transactions and functions they are permitted | Role-based folders; only finance can reach banking, only sales can reach pricing | Permission export |
| 3 | Verify and control connections to external systems | Personal devices only through managed accounts; no personal cloud sync of contract files | Device/MDM policy |
| 4 | Control information posted on public systems | Only the CIO or CEO approves anything posted to the website, Amazon or social media that mentions a government customer | Approval log |
| 5 | Identify users, processes and devices | Unique user IDs; device inventory | Asset inventory (section 3) |
| 6 | Authenticate before access | MFA required on email, file storage, banking, SAM.gov and Login.gov | Admin console MFA report |
| 7 | Sanitize or destroy media before disposal or reuse | Factory reset and encryption wipe before any device leaves; paper is shredded | Disposal log |
| 8 | Limit physical access to systems | Office and facility locked; servers or NAS (if any) in a locked room | Key/badge list |
| 9 | Escort visitors, log physical access, control keys and badges | Visitor sign-in at the facility; keys tracked | Visitor log |
| 10 | Monitor and protect communications at system boundaries | Firewall on the office network; separate guest Wi-Fi | Router configuration screenshot |
| 11 | Separate public-facing components from internal networks | Website and store hosted off-site by the vendor, never on the office network | Hosting contract |
| 12 | Identify, report and correct flaws on time | Automatic OS and browser updates; critical patches within 14 days | Patch status report |
| 13 | Protect against malicious code at appropriate locations | Built-in endpoint protection (Defender / XProtect) on every device | Endpoint console |
| 14 | Update malicious-code protection when new releases come out | Automatic definition updates on | Endpoint console |
| 15 | Periodically scan systems, and scan external files in real time | Weekly full scan; real-time scanning of downloads and attachments | Scan report |

## 3. Asset and Section 889 inventory

| Asset | User | OS / model | MFA | Encrypted | Covered telecom (Huawei, ZTE, Hikvision, Dahua, Hytera)? |
| --- | --- | --- | --- | --- | --- |
| \[Laptop\] | \[name\] | \[model\] | Yes | Yes | No |
| \[Phone\] | \[name\] | \[model\] | Yes | Yes | No |
| \[Security cameras at facility\] | — | \[brand\] | n/a | n/a | \[Check: Hikvision and Dahua cameras are covered telecom\] |
| \[Router / Wi-Fi\] | — | \[brand\] | n/a | n/a | \[Check\] |

## 4. Incident response

1. Anyone who suspects a breach, a lost device or a phishing compromise tells the CIO within 1 hour.
2. The CIO contains it: resets credentials, wipes or locks the device remotely, and preserves logs.
3. If FCI or government information is involved, the CIO notifies the contracting officer within 72 hours (or the contract's stated window) and logs what happened, what data was involved, and the fix.

## 5. Review

The CIO reviews this policy and the asset list every year and after any incident. Every user signs that they have read it: \[signature, date\].
