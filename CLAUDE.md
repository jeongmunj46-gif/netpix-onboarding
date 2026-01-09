# 

## 1. Project Overview


---

## 2. Key Features



## 3. Architecture & Data Flow



## 4. Development Rules (STRICT)

### CRITICAL: DATABASE PROTECTION (ABSOLUTE RULE)

**NEVER EVER EXECUTE DATABASE DESTRUCTIVE COMMANDS**

This is the **HIGHEST PRIORITY RULE**. Violation of this rule has caused **CATASTROPHIC DATA LOSS** multiple times.

**ABSOLUTELY FORBIDDEN COMMANDS:**
```sql
DROP DATABASE / DROP TABLE / TRUNCATE TABLE
DELETE FROM table_name (without WHERE)
ALTER TABLE ... DROP COLUMN
```

**SAFE ALTERNATIVES:**
- Schema changes: Use JPA entity modifications + Hibernate auto DDL update
- If schema conflict: **STOP and ASK USER** how to proceed
- If FK constraint error: Fix the code logic, NOT reset the database

### Code Quality Rules

**TypeScript:**
- **NEVER use `any` type** - causes build failures. Use `unknown` or define interfaces.
- Run `npx tsc --noEmit` after TypeScript changes to verify types.

**Java/Spring Boot:**
- Use Lombok annotations (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`).
- Use `@Transactional(readOnly = true)` for read operations.
- Use `@Query` annotations for custom JPQL queries.
- Build with `./gradlew build` to verify compilation.

**Naming Conventions:**
- Names must be self-descriptive and context-independent.
- Avoid temporal qualifiers like `new`, `temp`, `updated`.

**Cleanup:**
- When changes make code obsolete, clean up immediately.
- Never leave unused imports or dead code.

### Project-Specific Patterns

**Package Manager:**
- Frontend: Use **npm**
- Backend: Use **Gradle** (`./gradlew build`, `./gradlew bootRun`)

**API Client Usage:**
- All API calls must go through `lib/api/*` modules.
- Response format: `{ success: boolean, data?: T, message?: string }`.
- Always check `response.success` before accessing `response.data`.

**Authentication:**
- Use `useAuth()` hook from `AuthContext`.
- JWT tokens stored in localStorage.

**Git Commits:**
- Write commit titles in **Korean only**, concise, single line.
- Example: "직원 목록 정렬 기능 추가"

### Workflow Rules

**User Confirmation:**
- Do NOT immediately execute code modifications upon receiving a request.
- First analyze, ask questions, and propose a plan.
- ONLY proceed when user explicitly says "Start", "Proceed", or similar.

**Terminal Operations:**
- Non-interactive commands ONLY (stdin is closed).
- ALWAYS use flags like `-y`, `--force` for non-interactive mode.

**Language:**
- Communicate in the language user initiated with.
- Internal processing/thinking in English for efficiency.
