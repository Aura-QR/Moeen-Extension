# Enrichment (إثراء) — Investigation v2 (Updated Findings)

**Date:** 2026-05-21 (later session, same day)
**File:** `content.js` — Chrome extension for `schools.madrasati.sa`
**Status:** ✅ **RESOLVED.** Both root causes identified. Fix #1 and Fix #2
applied and verified live across multiple test runs.
Cleanup of the obsolete `silentAttachEnrichmentToLecture` path is the only
remaining task (cosmetic — does not affect behavior).

---

## TL;DR for the parallel developer

The previous report (`ENRICHMENT_INVESTIGATION.md`) had **two incorrect conclusions**
that this session corrected by analyzing the competitor HAR (`competitor_full__1_.json`)
end-to-end:

| Old belief (v1)                                                                                   | New finding (v2)                                                                                                                                              |
|---|---|
| CSRF must be scraped from `GET /MangeResources/Create?isNotUserLayout=True&...`                  | That GET now returns `301 → /Errors/NotPermitted`. The competitor never GETs `MangeResources/Create` — it reuses the CSRF from `GET /Projects/Projects/Create?schoolId=<hex>`. |
| "Enrichment is a standalone resource — it does NOT add any fields to `SaveLastLessonPlan` payload" | **WRONG.** Enrichment is bound to the lecture **inside** `SaveLastLessonPlan` via four `LectureClassLearningResources[0].*` multipart fields. There is no separate attach call. |

The `AddActivityToLecture` endpoint we currently call returns `success: true` but the
enrichment never appears on the lecture page — it links the resource somewhere else
(probably the teacher's general resource library), not to the lesson time slot.

---

## Background

When a teacher clicks **"حفظ وبدء التحضير"**, the extension silently creates and
binds up to four resource types to the lesson plan: Activity (نشاط), Homework (واجب),
Exam (اختبار), Enrichment (إثراء). Each toggles independently from the dashboard.

This session focused on Enrichment, which was producing log lines that looked
successful (`✅ Enrichment created`, `✅ Enrichment linked to lecture`) but the
enrichment never appeared in the lecture's "إثراءات المعلم" section after save.

---

## Symptom

Test setup: Activity OFF, Enrichment ON, Homework ON, Exam ON (existing exam reused).

Initial console output:
```
❌ [Moeen-2] Enrichment: Create GET redirected to unexpected URL:
    https://schools.madrasati.sa/Errors/NotPermitted — session may have expired
```

The Network tab confirmed:
```
GET /LearningResources/MangeResources/Create?isNotUserLayout=True&selectedSubjectId=309&isMainPage=False
→ 301
Location: https://schools.madrasati.sa/Errors/NotPermitted
```

Session was valid (other endpoints in the same page load returned 200). The server
is rejecting this specific GET on this specific endpoint with this specific query
string. The token scrape failed, and the entire enrichment flow aborted before the
POST was even attempted.

---

## Investigation — Reading the Competitor HAR End-to-End

Searched the HAR for every request touching `MangeResources`. There are only three:

```
[7] POST 200  /LearningResources/MangeResources/GetGoalLessonSubject
[8] POST 302  /LearningResources/MangeResources/Create        ← no query string
[9] GET  200  /LearningResources/MangeResources/Index/{hex}    ← DIFF source
```

**The competitor never performs `GET /MangeResources/Create`.** It does not need to,
because the CSRF token it uses for the enrichment POST is the same one already obtained
earlier in the session from `GET /Projects/Projects/Create?schoolId=<hex>` (entry [4]).

This is consistent with how ASP.NET MVC anti-forgery tokens work: one session-scoped
token is valid across every endpoint that shares the same `__RequestVerificationToken`
cookie, regardless of which page rendered the form. Validated by inspecting the POST
header — the `__RequestVerificationToken` field in the competitor's enrichment POST
matches the token from `Projects/Projects/Create`, not from `MangeResources/Create`.

---

## Root Cause #1 — CSRF Source

`silentCreateEnrichmentResource` was fetching its CSRF from a GET that the server
now refuses with `301 → /Errors/NotPermitted`. The fix is to fetch from the same
page used by `silentCreateActivityResource`:

```
GET /Projects/Projects/Create?schoolId=<hexSchoolId>
```

This works regardless of `MangeResources` permission state, returns 200, and the
returned token is valid for the subsequent `POST /MangeResources/Create`.

### Fix applied (verified live)

In `silentCreateEnrichmentResource`, the GET URL was changed from
`/LearningResources/MangeResources/Create + _createQs`
to
`/Projects/Projects/Create?schoolId=<hexSchoolId>`.

The redirect guard was also updated to check for `Projects/Projects/Create` in the
final URL instead of `MangeResources`.

The rest of the function (HashKey scrape, hfDrawTree scrape, goals fetch, payload
build, the POST to `MangeResources/Create + _createQs`) was **not touched**.

### Result

```
✅ [Moeen-2] Enrichment Create page scraped → token: CfDJ8C_PzEF7_shPnYpf... | hashKey: AKg7YujIcNejavnMmGxM...
✅ [Moeen-2] Enrichment: SelectedGoles built with 3 goal(s) for lessonId 26678
✅ [Moeen-2] Enrichment POST payload → Name: إثراء: ... | hfLevelsCount:1 | golesLen: 156
✅ [Moeen-2] Enrichment created successfully (302 redirect) — resolving activity ID via DIFF...
✅ [Moeen-2] Enrichment DIFF → new activity ID: A98901A41A001F64A2292921C701B76C (after 1000 ms, probe 1)
✅ [Moeen-2] AddActivityToLecture POST → activityId: A98901A41A001F64A2292921C701B76C
✅ [Moeen-2] AddActivityToLecture accepted → response: {success: true, activityId: 'A98901A41A001F64A2292921C701B76C', ...}
✅ [Moeen-2] Enrichment linked to lecture → activityId: A98901A41A001F64A2292921C701B76C
```

Enrichment POST succeeded (302). DIFF resolved a fresh hex GUID on the first probe.
The `AddActivityToLecture` call returned `success: true`.

**But:** opening the lecture page (`ManageLecture?lectureId=2`) showed the enrichment
section completely empty. The exam appeared, the lecture itself was marked prepared,
but no enrichment card was bound to the lesson.

---

## Root Cause #2 — Wrong Binding Endpoint

`AddActivityToLecture` returns `success: true` and does in fact link the activity
somewhere — but **not** to the lecture's `LectureClassLearningResources` collection.
It likely links to the teacher's general resource library or a different join table.
Either way, the lecture page does not surface it.

The competitor HAR has **zero** requests to `AddActivityToLecture` anywhere in the
save flow. Instead, the enrichment binding lives **inside the `SaveLastLessonPlan`
multipart payload itself**, in four fields:

```
LectureClassLearningResources[0].ActivityType   = "1"
LectureClassLearningResources[0].ActivityPath   = ""
LectureClassLearningResources[0].Name           = <lesson name string>
LectureClassLearningResources[0].ActivityId_Enc = <32-hex GUID from Enrichment creation>
```

Verified by parsing `competitor_full__1_.json` entry [20] (the `SaveLastLessonPlan`
POST) as `multipart/form-data` and locating the four fields above. The
`ActivityId_Enc` value is the same hex GUID that appeared in `MangeResources/Index`
after the enrichment POST in entry [8] — confirming the round-trip.

For reference, the analogous bindings for the other resource types are:

```
LectureProjectsList[0].ProjectId      ← Activity (numeric)
LectureAssignmentsList[0].AssignmentId ← Homework (numeric)
LectureExamsList[0].ExamId            ← Exam (numeric)
LectureClassLearningResources[0]...   ← Enrichment (hex GUID via ActivityId_Enc)
```

So all four resource types share the same architecture: create the resource via its
own endpoint, then bind to the lecture by appending the resulting ID into one of
four parallel arrays in the `SaveLastLessonPlan` multipart body.

### Fix #2 applied and verified live

In `content.js`, immediately after the existing `LectureProjectsList[0]` block in
the `SaveLastLessonPlan` payload-building section, the following was appended:

```js
if (enrichmentActivityId) {
  deleteFormDataPrefix(finalForm, 'LectureClassLearningResources[');
  finalForm.append('LectureClassLearningResources[0].ActivityType', '1');
  finalForm.append('LectureClassLearningResources[0].ActivityPath', '');
  finalForm.append('LectureClassLearningResources[0].Name', String(lessonName || ''));
  finalForm.append('LectureClassLearningResources[0].ActivityId_Enc', String(enrichmentActivityId));
}
```

`enrichmentActivityId` was already in scope at that point — awaited and logged
earlier in the same function around line 3076–3079.

### Verification result

Test setup: Activity OFF, Enrichment ON, Exam ON (reused existing exam).

Console output after save:
```
✅ [Moeen-2] LectureClassLearningResources[0] (Enrichment) →
   ActivityId_Enc: AD8449C63E1D3BF75343E5AD912773A2
   Name: -- آداب التعامل -- الدرس (2) ...
```

Lecture page after save:
- The "إثراءات المعلم" section now contains a card titled
  `إثراء: <lessonName>` — confirming the binding worked.
- The lecture is marked prepared in the weekly schedule (green check).
- Test was repeated three times — all three succeeded with the enrichment
  appearing on the lecture every time.

### Follow-up cleanup (pending)

Fix #2 is verified, so the legacy `silentAttachEnrichmentToLecture` path is now
dead code. It still runs on every save (returning `success: true` harmlessly),
but contributes nothing to the lecture binding. Remove it in a follow-up edit:

1. Remove the `silentAttachEnrichmentToLecture` call block in the save flow
   (currently around lines 3688–3700).
2. Remove the `silentAttachEnrichmentToLecture` function definition itself
   (currently starting around line 2105).
3. Optionally: rename or simplify any helper variables that only existed to
   feed that call.

This cleanup is cosmetic and does not affect behavior — the enrichment already
appears on the lecture via Fix #2. Defer if you want to keep the diff minimal
for the next handoff.

---

## How to Verify Fix #2 Live

After applying the edit:

1. `node --check content.js` — passes with no output.
2. Reload the extension in `chrome://extensions`.
3. On `TeacherSchedule`, open DevTools → Console.
4. Same test as before: Activity OFF, Enrichment ON, Homework + Exam as desired.
5. Click "حفظ وبدء التحضير" on a lesson.
6. Wait for the save to fully complete (the "جاري تحضير الحصص" banner disappears).
7. Open the prepared lesson via `ManageLecture`.
8. Scroll to the "إثراءات المعلم" section.

**Success criterion:** an enrichment card titled `إثراء: <lessonName>` appears in
the "إثراءات المعلم" section of the lecture page. The previous "+ إضافة إثراء"
empty-state placeholder must be gone.

**Sanity check in Network tab:** the `SaveLastLessonPlan` request payload should
contain the four `LectureClassLearningResources[0].*` fields. Use DevTools →
Network → SaveLastLessonPlan → Payload to confirm.

---

## Key API Endpoints Summary (updated)

| Purpose                                       | Method | URL                                                       |
|---|---|---|
| Get CSRF for Enrichment POST                  | GET    | `/Projects/Projects/Create?schoolId={hexSchoolId}` ✅ updated |
| Create enrichment                             | POST   | `/LearningResources/MangeResources/Create + _createQs`    |
| Fetch goals for SelectedGoles                 | POST   | `/LearningResources/MangeResources/GetGoalLessonSubject`  |
| Resolve enrichment activity ID (DIFF source)  | GET    | `/LearningResources/MangeResources/Index/{hexSchoolId}`   |
| Bind enrichment to lecture                    | (none — embedded in `SaveLastLessonPlan` multipart payload as `LectureClassLearningResources[0].*`) |
| ~~Bind enrichment via separate call~~         | ~~POST `/Teacher/LectureTools/AddActivityToLecture`~~ — returns `success: true` but does NOT make the enrichment appear on the lecture page. **To be removed after Fix #2 verifies.** |
| Dead end — forbidden                          | GET    | `/Teacher/LectureTools/GetActivitiesList` → 302 NotPermitted |

---

## Files Touched This Session

| File          | Change                                                           | Status                          |
|---|---|---|
| `content.js`  | Fix #1 — CSRF source switched to `Projects/Projects/Create`     | Applied + verified live ✅       |
| `content.js`  | Fix #2 — add `LectureClassLearningResources[0].*` in `SaveLastLessonPlan` | Applied + verified live ✅       |
| `content.js`  | Cleanup — remove `silentAttachEnrichmentToLecture` and its call | Pending (cosmetic, non-blocking) |

---

## Open Questions / Risks

1. **Quran subject:** the local `madrasati_courses_clean.json` does not include Quran
   goals; the competitor fetches them live from `GetGoalLessonSubject`. The current
   code already calls `GetGoalLessonSubject`, so this is likely fine — but it has
   not been tested on a Quran lesson in this session.

2. **Multiple resource types in the same payload:** the competitor HAR shows the
   `LectureClassLearningResources[0]`, `LectureProjectsList[0]`, `LectureAssignmentsList[0]`,
   and `LectureExamsList[0]` all appended in the same `SaveLastLessonPlan` payload.
   Our `deleteFormDataPrefix(finalForm, 'LectureClassLearningResources[')` should
   prevent any stale array entries from a previous save bleeding through, mirroring
   the existing approach for the other three lists.

3. **`ActivityType` value:** the competitor sent `"1"`. We do not know what other
   values map to (probably resource kind, e.g. video/PDF/link). We hardcode `"1"`
   to match the captured trace. If different enrichment types need different values,
   that would be a separate investigation.

4. **`ActivityPath` empty:** the competitor sent an empty string. The enrichment
   POST itself sent `Link = https://ien.edu.sa`. These do not appear to be the same
   field. We hardcode empty to match the trace.
