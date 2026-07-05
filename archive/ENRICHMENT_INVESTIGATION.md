# Enrichment (إثراء) — Investigation & Implementation Report

**Date:** 2026-05-21  
**File:** `content.js` — Chrome extension for `schools.madrasati.sa`  
**Author:** Developer note for project lead

---

## Background

The Moeen-2 extension automates lesson-plan preparation (تحضير الحصص) for teachers on Madrasati.
When a teacher clicks **"حفظ وبدء التحضير"**, the extension silently creates and links four resource
types to the lesson plan: Activity (نشاط), Homework (واجب), Exam (اختبار), and Enrichment (إثراء).  
Each resource type can be toggled on or off from the dashboard panel.

---

## The Enrichment Problem

### What We Were Trying to Do

After creating an enrichment resource via the API, the extension needs to:
1. Resolve the **activity ID** (a 32-character hex GUID) of the newly-created enrichment
2. Call `AddActivityToLecture` to link that enrichment to the lesson's time slot

This two-step flow works for Activity because Madrasati echoes back a numeric `ProjectId`.  
For Enrichment it does not — the creation endpoint (`MangeResources/Create`) returns HTTP 302
redirect on success but provides no ID in the response body.

---

## Investigation — What We Found

### Dead End 1: `GetActivitiesList`

The first instinct was to call `GET /Teacher/LectureTools/GetActivitiesList` to retrieve
the list of teacher enrichments and diff it for a newly-created one.

**Finding:** This endpoint returns HTTP **302 → NotPermitted** for the teacher role.  
It is forbidden and cannot be used.

### Dead End 2: `GetActivitiesList` via enrichment-scoped variant

Tried probing the same endpoint with different query parameters and resource-type filters.  
Same result: permission denied regardless of parameters.

### Dead End 3: `GetActivitiesList` (lesson bank)

There is a separate call that *does* return 200 — but it only lists **IEN/curated enrichments
from the Ministry lesson bank**, not teacher-created ones.  
Even immediately after successfully creating an enrichment, querying this endpoint returns
`"لايوجد إثراءات"` (no enrichments found).  
**Teacher-authored enrichments never appear here.**

### Root Cause Found: Wrong Data Source

The **correct** source for teacher-created enrichments is:

```
GET /LearningResources/MangeResources/Index/{schoolId}
```

This page lists all teacher-authored enrichments and embeds the hex-GUID `activityId`
in edit/view URLs in two patterns:

```
activityId=<32-hex-chars>
ViewResource/Index/<32-hex-chars>
```

This was confirmed by scraping the page before and after enrichment creation — the new
GUID appears in the HTML within 1–12 seconds of a successful POST.

---

## What We Did — Solution Implemented

### 1. DIFF-Based Activity ID Resolution (`_indexSnapshot` + `_pollForNewActivityId`)

```
Before POST  →  snapshot A (MangeResources/Index)
After POST   →  poll snapshot B every 1-2-3-3-3 seconds (≤ 12 s total)
New ID       =  B − A
```

- Takes a **before-snapshot** of existing enrichment IDs from `MangeResources/Index`
- POSTs the enrichment creation
- Polls up to **5 times** (schedule: 1 s, 2 s, 3 s, 3 s, 3 s) until a new GUID appears
- Fallback: if `before` was empty and `after` has items, takes the first entry (newest)
- If exhausted with no new ID, logs a warning and **skips attachment** (fail-soft — lesson save is not aborted)

### 2. Enrichment Creation Payload Specifics

Discovered differences between Activity and Enrichment that are not documented anywhere:

| Field | Activity | Enrichment |
|---|---|---|
| `Id` | `""` (empty string) | `"0"` |
| `hfLevelsCount` | `"3"` | `"1"` |
| `SelectedGoles` | not required | required — base64-encoded JSON `[{GoalId, LessonId}]` |
| `IndicativeWords` | not required | required — UTF-8 base64 |
| endpoint | `Teacher/LectureTools/ManageLecture` area | `LearningResources/MangeResources/Create` |

**`SelectedGoles` handling:**
- Calls `POST /LearningResources/MangeResources/GetGoalLessonSubject` with `subjectId`
- Filters returned goals for the current `lessonId`
- If none match: falls back to the first 10 goals from the subject (empty array causes server to silently return 200 with a form, i.e. creation fails without an error code)

**CSRF token scraping:**
- Using `?schoolId=...` caused the server to redirect to the homepage (which has no CSRF token)
- Correct query string: `?isNotUserLayout=True&selectedSubjectId={subjectId}&isMainPage=False`
- Also scrapes `HashKey` (required) and `hfDrawTree` (draw-tree path override)

### 3. Lecture Linking (`silentAttachEnrichmentToLecture`)

Once the hex GUID is resolved, calls:

```
POST /Teacher/LectureTools/AddActivityToLecture
  activityId  = <hex-guid>
  SchoolId    = ...
  selectedUnitId = ...
  TimeTableId = ...
  sDate / eDate / DayCount
```

Enrichment is a **standalone resource** — it does NOT add any fields to the
`SaveLastLessonPlan` payload (unlike Activity/Homework/Exam which add `LectureProjectsList`,
`LectureAssignmentsList`, `LectureExamsList` respectively).

### 4. Concurrency

Enrichment creation runs **concurrently** with Homework and Exam creation (via `Promise.all`-like
approach) while the main thread waits for the DB-sync polling required by Activity.
This keeps total wall-clock time minimal.

---

## Related Bug Fixed (Same Session)

While investigating enrichment, a second bug was found and fixed in the same code path:

**Bug:** When the teacher **disabled** Activity (نشاط) via the toggle, the activity was still
being silently linked to the lesson plan.

**Root cause:**
- When Activity is skipped, `beforeSnapshot` is initialized to `new Set()` (empty)
- The Tier-A DIFF still ran unconditionally: `afterSnapshot − emptySet = all existing projects`
- The largest existing project ID was then used as `activityProjectId`
- `resolvedProjectId = activityProjectId || formProjectId` passed this stale ID into the
  `SaveLastLessonPlan` payload → server linked an unrelated activity to the lesson

**Fix applied:**
- Tier A/B/C resolution block is now wrapped in `if (_shouldRunActivity)`
- All three `resolved*` IDs are gated on their resource toggle:
  ```js
  const resolvedProjectId    = _shouldRunActivity ? (activityProjectId || formProjectId) : null;
  const resolvedAssignmentId = _resHomework       ? (homeworkAssignmentId || formAssignmentId) : null;
  const resolvedExamId       = _resExam           ? (examId || formExamId) : null;
  ```
- Form-scraped fallback IDs from a previous save can no longer bleed through when the
  corresponding toggle is off

---

## Current State

| Feature | Status |
|---|---|
| Enrichment Create (MangeResources/Create POST) | ✅ Working |
| Activity ID resolution via MangeResources/Index DIFF | ✅ Working |
| Lecture linking via AddActivityToLecture | ✅ Working |
| Toggle on/off from teacher dashboard | ✅ Working |
| Activity fix — skipped when toggle is off | ✅ Fixed |
| Form-ID bleed-through for all resource types | ✅ Fixed |

---

## Key API Endpoints Summary

| Purpose | Method | URL |
|---|---|---|
| Create enrichment | POST | `/LearningResources/MangeResources/Create` |
| Resolve enrichment ID (DIFF source) | GET | `/LearningResources/MangeResources/Index/{schoolId}` |
| Fetch lesson goals | POST | `/LearningResources/MangeResources/GetGoalLessonSubject` |
| Link enrichment to lecture | POST | `/Teacher/LectureTools/AddActivityToLecture` |
| **Dead end** — forbidden | GET | `/Teacher/LectureTools/GetActivitiesList` → 302 NotPermitted |
