# Input Documents

Place your project-specific documents here before running BUILD.md.

---

## Required Files

| File | Who Creates It | Required? |
|------|---------------|-----------|
| `features.md` | Solution Architect / Product Owner | YES |
| `fdd-user-flows.md` | Solution Architect (FDD Agent) | YES |
| `fdd-edge-cases.md` | Solution Architect | Recommended |
| `api.md` | Backend Team (Swagger/OpenAPI export) | YES |
| `frontend-standards.md` | Frontend Lead — same for all IQARX projects | YES |

---

## Quality Checklist (verify before running BUILD.md)

### features.md
- [ ] Has Feature IDs (F-001, F-002...)
- [ ] Describes business rules with clear conditions
- [ ] Defines state machines (if applicable)
- [ ] Lists error codes with descriptions
- [ ] Defines user roles and permissions

### fdd-user-flows.md
- [ ] Lists every screen/page with: name, route, access level
- [ ] Each screen has: Data Displayed table (what data, which API)
- [ ] Each screen has: Components table (what UI elements)
- [ ] Each screen has: User Actions table (trigger, result, error handling)
- [ ] Each screen has: Screen States (loading, populated, empty, error, offline)
- [ ] Each screen has: Form Behavior table (if applicable — field, type, validation, error message)
- [ ] Has Navigation Architecture: sidebar/tab definitions per role
- [ ] Has Screen Transition Map: from → to, trigger, params, back behavior
- [ ] Has Deeplink/URL schema
- [ ] Has Authentication gates
- [ ] Has Global persistent elements (header, sidebar, toast, offline banner)
- [ ] See `fdd-user-flows.template.md` for the exact format

### fdd-edge-cases.md
- [ ] Categorized by type: EC-NET, EC-STATE, EC-INPUT, EC-TIME, EC-DATA
- [ ] Each edge case has: ID, description, resolution
- [ ] See `fdd-edge-cases.template.md` for the exact format

### api.md
- [ ] Every endpoint: HTTP method + full path
- [ ] Every endpoint: request body shape with field types
- [ ] Every endpoint: response shape with field types
- [ ] Every endpoint: error responses (401, 422, 429, 500)
- [ ] Every endpoint: auth requirement (public, authenticated, admin)
- [ ] Pagination pattern documented (page, page_size, sort)
- [ ] Common response wrapper documented (ApiResponse<T>)

### frontend-standards.md
- [ ] Architecture decisions (which libraries, why)
- [ ] Folder structure
- [ ] Naming conventions
- [ ] Component patterns
- [ ] State management rules
- [ ] Data fetching patterns
- [ ] Testing requirements
- [ ] Code quality gates

---

## How to Run

Once all docs are ready:

```bash
cd my-project
claude
> Read BUILD.md and begin.
```
