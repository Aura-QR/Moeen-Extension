
(() => {
  // --- حماية: منع الإضافة من العمل داخل إطارات عشوائية ---
  if (window !== window.top) {
    if (!window.location.search.includes('Moeen-2_iframe') && !window.name.includes('Moeen-2_iframe')) {
      return; // not our subframe — get out
    }
  }





  function getSubjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('courseId')) return urlParams.get('courseId');
    if (urlParams.has('CourseId')) return urlParams.get('CourseId');
    return null;
  }
  // --------------------------------------------------------
  const COMPETITOR_PREP_TEXTS = [
    "تحليل المعلومات المقدمة واستنتاج الافكار الرئيسية.",
    "تنمية القدرة على التواصل بفعالية حول موضوع الدرس.",
    "الربط بين المعرفة السابقة والمفاهيم الجديدة المكتسبة.",
    "التقييم الذاتي للفهم الشخصي لموضوع الدرس واكتشاف أي نقاط ضعف."
  ];

  const COMPETITOR_STRATEGIES_TEXTS = [
    "مناقشة الافكار الرئيسية المتعلقة بـ (اسم الدرس هنا).",
    "تطبيق الامثلة العملية المرتبطة بـ (اسم الدرس هنا).",
    "توجيه الاسئلة للحصول على توضيحات حول (اسم الدرس هنا).",
    "تحفيز التفكير النقدي عبر تحليل جوانب مختلفة من (اسم الدرس هنا).",
    "توجيه الطالب لاستكشاف الفيديوهات التعليمية المتعلقة بـ (اسم الدرس هنا)."
  ];

  // دالة المحاكاة لاختيار نص عشوائي زي المنافس
  function getCompetitorText(type, lessonName) {
    let arrayToUse = type === 'strategies' ? COMPETITOR_STRATEGIES_TEXTS : COMPETITOR_PREP_TEXTS;
    let randomIndex = Math.floor(Math.random() * arrayToUse.length);
    let selectedText = arrayToUse[randomIndex];

    // استبدال القالب باسم الدرس الحقيقي زي ما بيعملوا
    return selectedText.replace(/\(اسم الدرس هنا\)/g, lessonName || "الدرس الحالي");
  }
  /*
  
   * content.js is generated from src/content/.
   * Run npm run build before loading or packaging the extension.
   * * * */
  (() => {
    // src/content/constants.js
    var CONFIG = globalThis.Moeen2_CONFIG || {};
    var STORAGE_KEYS = CONFIG.STORAGE_KEYS || {};
    var SETTINGS_DEFAULTS = CONFIG.SETTINGS_DEFAULTS || {};
    var AUTOMATION_STATE_KEY = STORAGE_KEYS.AUTOMATION_STATE || "automationState";
    var SAVE_SUBMITTED_AT_KEY = "automationSaveSubmittedAt";
    var AI_LESSON_DATA_KEY = "aiLessonData";
    var AUTOMATION_MODE_KEY = "automationMode";
    var AUTH_SESSION_KEY = CONFIG.AUTH_SESSION_KEY || "HADAR_AUTH";
    // Keep dashboard preparation inside the signed-in Madrasati tab, matching
    // the proven browser workflow from commit 8682ee2. This avoids depending
    // on transferring Madrasati authentication cookies to the backend.
    var BACKEND_PREPARATION_ENABLED = false;
    var BACKEND_PREPARATION_BATCH_KEY = "HADAR_BACKEND_PREPARATION_BATCH";
    var _lastPreparedPayload = null;
    var _lastLessonContext = null;
    var N8N_AI_WEBHOOK_URL = "https://n8n.qraura.shop/webhook/mo3een-ai-generator2";
    var N8N_AI_API_KEY = "sk-mo3een-super-secret-2026";
    var AI_WEBHOOK_TIMEOUT_MS = 25000;
    var ACTION_LOCK_PREFIX = "Moeen-2ActionLock";
    var STEP1_NEXT_LOCK_TTL_MS = 9e4;
    var FINAL_SAVE_LOCK_TTL_MS = 12e4;
    var DEFAULT_LESSON_TEXT = "\u062A\u0645 \u0627\u0644\u0625\u0639\u062F\u0627\u062F \u0648\u0641\u0642 \u0645\u0646\u0627\u0647\u062C \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645";
    var UI_IDS = Object.freeze({
      container: "Moeen-2-container",
      status: "Moeen-2-status"
    });
    var FLOW_STATES = Object.freeze({
      IDLE: "IDLE",
      STEP1: "STEP1",
      STEP2: "STEP2",
      DONE: "DONE",
      ERROR: "ERROR",
      DASHBOARD: "DASHBOARD"
    });
    var STEP1_SELECT_IDS = [
      "SelectedUnitId",
      "SelectedTrees_2",
      "SelectedTrees_3",
      "SelectedTrees_4",
      "SelectedTrees_5",
      "SelectedTrees_6"
    ];
    var DASHBOARD_SELECTIONS_KEY = STORAGE_KEYS.DASHBOARD_SELECTIONS || "dashboardSelections";
    var TARGET_RADIOS = ["\u062F\u0631\u0633", "\u0625\u0646\u0634\u0627\u0621 \u062C\u062F\u064A\u062F"];
    var SAVE_LATER_PATTERN = /IsSaveLater|save later/i;
    var LESSON_FORM_SELECTOR = 'textarea, [contenteditable="true"], .submit-form-btn, #sub, a[href="#finish"]';
    var REQUIRED_LESSON_CHECKBOX_GROUPS = [
      'input[name="goals"]',
      'input[name="activities"]',
      'input[name="strategies"]',
      'input[name="teachingTools"]'
    ];
    var EXPLICIT_LESSON_FIELD_VALUES = Object.freeze({
      LectureClassPreparationText: "\u062A\u0645\u0647\u064A\u062F \u0645\u0646\u0627\u0633\u0628 \u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062F\u0631\u0633 \u0648\u0631\u0628\u0637\u0647 \u0628\u0627\u0644\u062E\u0628\u0631\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629.",
      LessonVocabulary: "\u0627\u0644\u0645\u0641\u0631\u062F\u0627\u062A \u0627\u0644\u0631\u0626\u064A\u0633\u0629 \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062F\u0631\u0633.",
      ThinkingSkills: "\u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629 \u0648\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0629 \u0648\u062A\u0646\u0638\u064A\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u062D\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0627\u062A.",
      LectureClassCloseText: "\u062A\u0644\u062E\u064A\u0635 \u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0627\u0644\u0631\u0626\u064A\u0633\u0629 \u0648\u0645\u0631\u0627\u062C\u0639\u0629 \u0633\u0631\u064A\u0639\u0629 \u0644\u0645\u0627 \u062A\u0645 \u062A\u0639\u0644\u0645\u0647.",
      TeacherNote: "\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0628\u0639\u0646\u0627\u064A\u0629 \u0648\u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0628\u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062F\u0627\u062E\u0644 \u0627\u0644\u062D\u0635\u0629."
    });
    function normalizeAIWebhookResponse(raw) {
      var data = Array.isArray(raw) ? raw[0] : raw;
      if (data && typeof data === "object" && data.data && typeof data.data === "object") {
        data = data.data;
      }
      if (!data || typeof data !== "object") return null;

      var prep = data.prep || data.preparation || data.LectureClassPreparationText || "";
      var goals = data.goals || data.Goals || "";
      var closure = data.closure || data.Closure || data.LectureClassCloseText || "";
      var vocabulary = data.vocabulary || data.Vocabulary || data.LessonVocabulary || "";
      var thinkingSkills = data.thinkingSkills || data.ThinkingSkills || "";
      var teacherNote = data.teacherNote || data.TeacherNote || "";
      var homework = data.homework || data.Homework || "";

      if (!prep && !goals && !closure && !vocabulary && !homework) return null;

      return {
        prep: prep,
        goals: goals,
        closure: closure,
        vocabulary: vocabulary,
        thinkingSkills: thinkingSkills,
        teacherNote: teacherNote,
        strategies: Array.isArray(data.strategies) ? data.strategies : [],
        tools: Array.isArray(data.tools) ? data.tools : [],
        homework: homework,
        LectureClassPreparationText: prep || goals || EXPLICIT_LESSON_FIELD_VALUES.LectureClassPreparationText,
        LectureClassCloseText: closure || EXPLICIT_LESSON_FIELD_VALUES.LectureClassCloseText,
        LessonVocabulary: vocabulary || EXPLICIT_LESSON_FIELD_VALUES.LessonVocabulary,
        ThinkingSkills: thinkingSkills || EXPLICIT_LESSON_FIELD_VALUES.ThinkingSkills,
        TeacherNote: teacherNote || EXPLICIT_LESSON_FIELD_VALUES.TeacherNote
      };
    }
    var LESSON_RESOURCE_ERROR_PATTERNS = [
      "\u0644\u0645 \u064A\u0643\u062A\u0645\u0644 \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u062F\u0631\u0633",
      "\u064A\u062A\u0639\u064A\u0646 \u0639\u0644\u064A\u0643 \u0625\u0636\u0627\u0641\u0629 \u0627\u062B\u0631\u0627\u0621 \u0623\u0648 \u0648\u0627\u062C\u0628 \u0623\u0648 \u0627\u062E\u062A\u0628\u0627\u0631 \u0623\u0648 \u0646\u0634\u0627\u0637 \u0648\u0627\u062D\u062F \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644",
      "\u064A\u062A\u0639\u064A\u0646 \u0639\u0644\u064A\u0643 \u0625\u0636\u0627\u0641\u0629 \u0625\u062B\u0631\u0627\u0621 \u0623\u0648 \u0648\u0627\u062C\u0628 \u0623\u0648 \u0627\u062E\u062A\u0628\u0627\u0631 \u0623\u0648 \u0646\u0634\u0627\u0637 \u0648\u0627\u062D\u062F \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"
    ];
    var SAVE_VALIDATION_ERROR_PATTERNS = [
      "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u062D\u0641\u0638",
      "7 \u0623\u064A\u0627\u0645 \u0645\u0633\u062A\u0642\u0628\u0644\u064A\u0629",
      "\u0633\u0628\u0639\u0629 \u0623\u064A\u0627\u0645 \u0645\u0633\u062A\u0642\u0628\u0644\u064A\u0629",
      "\u064A\u0645\u0643\u0646\u0643 \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u062D\u0635\u0635 \u0625\u0644\u0649 7 \u0623\u064A\u0627\u0645",
      "\u064A\u0645\u0643\u0646\u0643 \u0625\u0639\u062F\u062F \u0627\u0644\u062D\u0635\u0635 \u0625\u0644\u0649 7 \u0623\u064A\u0627\u0645"
    ];
    var DUPLICATE_LESSON_ERROR_PATTERNS = [
      "\u064A\u0648\u062C\u062F \u0644\u062F\u064A\u0643 \u062F\u0631\u0633 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627",
      "\u064A\u0648\u062C\u062F \u0644\u062F\u064A\u0643 \u062F\u0631\u0633 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627\u064B",
      "\u0646\u0641\u0633 \u0627\u0644\u0648\u0642\u062A \u062F\u0627\u062E\u0644 \u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A",
      "\u062F\u0631\u0633 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627",
      "\u062F\u0631\u0633 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627\u064B"
    ];
    var DEFAULT_SAVE_SELECTOR = '.submit-form-btn, #sub, a[href="#finish"]';

    // src/content/logger.js
    var DEBUG = false;
    function log(...args) {
      if (DEBUG) {
        console.debug("[\u062A\u062D\u0636\u064A\u0631\u064A]", ...args);
      }
    }

    // src/content/runtime-storage.js
    function isContextAlive() {
      try {
        return Boolean(chrome.runtime?.id);
      } catch {
        return false;
      }
    }
    function getLocal(keys) {
      if (!isContextAlive()) return Promise.resolve({});
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }
    function setLocal(data) {
      if (!isContextAlive()) return Promise.resolve();
      return new Promise((resolve) => chrome.storage.local.set(data, resolve));
    }
    function removeLocal(keys) {
      if (!isContextAlive()) return Promise.resolve();
      return new Promise((resolve) => chrome.storage.local.remove(keys, resolve));
    }
    function getSync(keys) {
      if (!isContextAlive()) return Promise.resolve({});
      return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
    }
    function sendRuntimeMessage(message) {
      return new Promise((resolve) => {
        if (!isContextAlive()) {
          resolve(null);
          return;
        }
        try {
          chrome.runtime.sendMessage(message, (response) => {
            void chrome.runtime.lastError;
            resolve(response);
          });
        } catch (error) {
          log("sendRuntimeMessage error:", error);
          resolve(null);
        }
      });
    }
    async function sendAutomationStatus(status, extra) {
      await sendRuntimeMessage({
        type: "AUTOMATION_STATUS",
        status,
        ...extra || {}
      });
    }

    function normalizeForBackendLog(aiDataOrGoalsData) {
      if (!aiDataOrGoalsData) return null;
      var d = aiDataOrGoalsData;
      return {
        preparation_text: d.LectureClassPreparationText || d.prep || "",
        goals: d.goals || "",
        closure: d.LectureClassCloseText || d.closure || "",
        vocabulary: d.LessonVocabulary || d.vocabulary || "",
        thinking_skills: d.ThinkingSkills || d.thinkingSkills || "",
        teacher_note: d.TeacherNote || d.teacherNote || "",
        strategies: Array.isArray(d.strategies) ? d.strategies : [],
        tools: Array.isArray(d.tools) ? d.tools : [],
        homework: d.homework || "",
        enrichment: d.enrichment || "",
        goal_ids: Array.isArray(d.goalIds) ? d.goalIds : [],
        ein_link: d.einLink || ""
      };
    }

    async function logPreparationToBackend(status, errorMessage) {
      try {
        var authData = await getLocal([AUTH_SESSION_KEY]);
        var session = authData[AUTH_SESSION_KEY];
        if (!session || !session.token) {
          log("logPreparationToBackend: no auth token, skipping");
          return;
        }

        var context = _lastLessonContext || {};
        var searchParams = new URLSearchParams(window.location.search);

        // Build selected_modules from context (which modules were actually prepared)
        var selectedModules = [];
        if (context.hasAssignment || context.selected_modules) {
          selectedModules = context.selected_modules || [];
        }
        // Fallback: derive from last prepared payload content
        if (!selectedModules.length && _lastPreparedPayload) {
          var p = _lastPreparedPayload;
          if (p.assignment || p.Assignment) selectedModules.push('assignment');
          if (p.homework || p.Homework) selectedModules.push('homework');
          if (p.enrichment || p.Enrichment) selectedModules.push('enrichment');
          if (p.exam || p.Exam) selectedModules.push('exam');
        }
        if (!selectedModules.length) selectedModules = ['assignment']; // backend default

        var payload = {
          status: status === "DONE" ? "done" : "error",
          source: "extension",
          lesson_title: context.lessonTitle || null,
          grade: context.grade || null,
          subject: context.subject || null,
          lesson_madrasati_id: searchParams.get("LessonId") || searchParams.get("lesson_madrasati_id") || null,
          chapter_id: searchParams.get("ChapterId") || searchParams.get("chapter_id") || null,
          classroom_id: searchParams.get("ClassRoomId") || searchParams.get("classroom_id") || null,
          school_madrasati_id: searchParams.get("SchoolId") || searchParams.get("schoolId") || searchParams.get("real_school_id") || null,
          time_table_id: searchParams.get("TimeTableId") || searchParams.get("time_table_id") || null,
          selected_modules: selectedModules,
          prepared_payload: normalizeForBackendLog(_lastPreparedPayload),
          error_message: status !== "DONE" ? (errorMessage || null) : null,
          automation_mode: (typeof AutomationController !== "undefined" && AutomationController.mode) || "auto"
        };

        var logResult = await sendRuntimeMessage({
          action: "LOG_LESSON_PREPARATION",
          token: session.token,
          tokenType: session.tokenType || "Bearer",
          payload: payload
        });
        if (!logResult || !logResult.ok) {
          throw new Error(logResult && logResult.error ? logResult.error : "Backend log request failed");
        }

        log("logPreparationToBackend: sent successfully to Hader backend");
      } catch (err) {
        console.warn("[حضر] logPreparationToBackend error (non-fatal):", err);
      }
    }

    // ── Headless API: local data fetchers (Background memory cache) ─────────────
    const _subjectCache = new Map();
    async function getLocalSubjectData(subjectId, subjectName) {
      const key = String(subjectId);
      if (_subjectCache.has(key)) return _subjectCache.get(key);
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { action: 'GET_LESSON_DATA', subjectId: key, subjectName: subjectName },
          (response) => {
            const data = response && response.ok ? response.data : null;
            _subjectCache.set(key, data);
            resolve(data);
          }
        );
      });
    }

    // ── Live fallback: fetch lessons directly from Madrasati's GetGoalLessonSubject endpoint
    // when the local JSON cache has no entry for this subjectId (e.g., Quran subjects).
    // Endpoint confirmed via network capture (POST, x-www-form-urlencoded, single field subjectId).
    // Returns an array shaped like local data items: [{ id, info: { compositeId, chapterId, name } }, ...]
    // or null on failure.
    async function fetchGoalLessonSubjectLive(subjectId) {
      if (!subjectId) return null;
      try {
        const url = window.location.origin + '/LearningResources/MangeResources/GetGoalLessonSubject';
        const body = 'subjectId=' + encodeURIComponent(String(subjectId));
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body
        });
        if (!res.ok) {
          console.warn('[Moeen-2 LIVE] GetGoalLessonSubject HTTP', res.status, 'for subjectId=', subjectId);
          return null;
        }
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('[Moeen-2 LIVE] GetGoalLessonSubject returned empty/non-array for subjectId=', subjectId);
          return null;
        }
        const lessons = [];
        for (const row of data) {
          if (!row || row.LessonId == null || !row.LessonTitle) continue;
          const treeId = (row.TreeId != null ? row.TreeId : '');
          lessons.push({
            id: row.LessonId,
            info: {
              compositeId: String(subjectId) + ',' + String(treeId) + ',' + String(row.LessonId),
              chapterId: treeId,
              name: row.LessonTitle
            }
          });
        }
        console.log('[Moeen-2 LIVE] GetGoalLessonSubject OK for subjectId=', subjectId, 'lessons=', lessons.length);
        return lessons;
      } catch (e) {
        console.warn('[Moeen-2 LIVE] GetGoalLessonSubject fetch error for subjectId=', subjectId, e);
        return null;
      }
    }
    // New: Fetch real digital content IDs using the endpoint provided by team lead
    async function fetchDigitalContentIdsFromPlayer(lessonId, chapterId) {
      if (!lessonId) return [];
      try {
        const body = new URLSearchParams();
        body.append('LectureClassId', '');
        body.append('TreeId', String(chapterId || lessonId));
        body.append('CopyMode', 'False');
        body.append('lessonId', String(lessonId));
        body.append('ViewMode', 'False');

        const res = await fetch(window.location.origin + '/Teacher/LectureTools/GetLessonPlayerForComponent', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body.toString()
        });

        if (!res.ok) return [];

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const ids = new Set();
        doc.querySelectorAll('input[type="checkbox"][name="activities"]').forEach(function (input) {
          const val = input && input.value ? String(input.value).trim() : '';
          if (/^\d+$/.test(val)) ids.add(val);
        });

        // Also catch any other checkboxes that might be digital content
        doc.querySelectorAll('#itemsDiv input[type="checkbox"]').forEach(function (input) {
          const val = input && input.value ? String(input.value).trim() : '';
          if (/^\d+$/.test(val)) ids.add(val);
        });

        console.log('[Moeen-2] GetLessonPlayerForComponent returned', ids.size, 'digital content IDs');
        return Array.from(ids);
      } catch (e) {
        console.warn('[Moeen-2] fetchDigitalContentIdsFromPlayer failed:', e && e.message);
        return [];
      }
    }

    async function fetchLessonGoalsAndActivities(subjectId, schoolId, chapterId, lessonId) {
      if (!subjectId || !lessonId) return { goalIds: [], activityIds: [] };
      try {
        const body = new URLSearchParams();
        body.append('subjectId', String(subjectId));
        if (schoolId) body.append('eschoolId', String(schoolId));
        body.append('treeId', String(chapterId || lessonId));
        body.append('lessonId', String(lessonId));
        body.append('isTreelevel', 'false');
        body.append('pageNumber', '1');
        body.append('searchInput', '');
        body.append('questionType', '');
        body.append('difficultyLevel', '');
        body.append('creator', '0');

        const res = await fetch(window.location.origin + '/LearningResources/MangeResources/GetGoalLessonSubject', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body.toString()
        });
        if (!res.ok) {
          console.warn('[Moeen-2] Goals/content lookup HTTP', res.status, 'subjectId=', subjectId, 'lessonId=', lessonId);
          return { goalIds: [], activityIds: [] };
        }

        const data = await res.json();
        if (!Array.isArray(data)) return { goalIds: [], activityIds: [] };

        const lessonIdNum = Number(lessonId);
        const matchingRows = data.filter(function (row) {
          return row && row.LessonId != null && Number(row.LessonId) === lessonIdNum;
        });
        const rows = matchingRows.length ? matchingRows : data;
        const goalSet = new Set();
        const activitySet = new Set();

        rows.forEach(function (row) {
          if (row && row.GoalId != null && String(row.GoalId).trim()) {
            goalSet.add(String(row.GoalId).trim());
          }
          const flatActivityId = row && (row.ActivityId || row.IenActivityId || row.activityId);
          if (flatActivityId != null && String(flatActivityId).trim()) {
            activitySet.add(String(flatActivityId).trim());
          }
          const ienActivities = row && Array.isArray(row.IenActivities)
            ? row.IenActivities
            : (row && Array.isArray(row.Activities) ? row.Activities : []);
          ienActivities.forEach(function (activity) {
            const id = activity && (activity.ActivityId || activity.IenActivityId || activity.Id || activity.activityId);
            if (id != null && String(id).trim()) activitySet.add(String(id).trim());
          });
        });

        console.log('[Moeen-2] Goals/content lookup OK — goals:', goalSet.size, 'digital activities:', activitySet.size, 'lessonId:', lessonId);
        return { goalIds: Array.from(goalSet), activityIds: Array.from(activitySet) };
      } catch (e) {
        console.warn('[Moeen-2] Goals/content lookup failed:', e && e.message);
        return { goalIds: [], activityIds: [] };
      }
    }
    function extractDigitalActivityIdsFromLessonDocument(doc) {
      const ids = new Set();
      if (!doc) return [];
      try {
        // 1. Checkboxes with name="activities" (user-provided structure)
        doc.querySelectorAll('input[name="activities"]').forEach(function (input) {
          const value = input && input.value != null ? String(input.value).trim() : '';
          if (/^\d+$/.test(value)) ids.add(value);
        });

        // 2. onclick loadLessonItem handlers
        doc.querySelectorAll('[onclick*="loadLessonItem"]').forEach(function (el) {
          const onclickText = el.getAttribute('onclick') || '';
          const match = onclickText.match(/loadLessonItem\([^)]*['"](\d+)['"]\s*\)/i);
          if (match && match[1]) ids.add(match[1]);
        });

        // 3. Anchors with id^="item_"
        doc.querySelectorAll('a[id^="item_"]').forEach(function (a) {
          const match = (a.id || '').match(/item_(\d+)/);
          if (match && match[1]) ids.add(match[1]);
        });

        // 4. Any element with data-activity-id or similar attributes (future-proof)
        doc.querySelectorAll('[data-activity-id],[data-id][data-type*="digital"]').forEach(function (el) {
          const val = el.getAttribute('data-activity-id') || el.getAttribute('data-id');
          if (val && /^\d+$/.test(val)) ids.add(val);
        });
      } catch (e) {
        console.warn('[Moeen-2] Digital content HTML scrape failed:', e && e.message);
      }
      return Array.from(ids);
    }
    async function getLocalTemplates() {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'GET_TEMPLATES' }, (response) => {
          resolve(response && response.ok ? response.data : null);
        });
      });
    }
    async function markFinalSaveSubmitted() {
      await setLocal({
        [AUTOMATION_STATE_KEY]: FLOW_STATES.DONE,
        [SAVE_SUBMITTED_AT_KEY]: Date.now()
      });
    }
    async function reopenAfterSaveValidationError() {
      await setLocal({
        [AUTOMATION_STATE_KEY]: FLOW_STATES.STEP2,
        [SAVE_SUBMITTED_AT_KEY]: 0
      });
    }
    async function clearSaveSubmittedMarker() {
      await removeLocal(SAVE_SUBMITTED_AT_KEY);
    }

    // src/content/dom-actions.js
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function isTrulyVisible(element) {
      if (!element) return false;
      try {
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
          return false;
        }
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      } catch {
        return false;
      }
    }
    function triggerEvents(element, eventTypes) {
      if (!element) return;
      const types = eventTypes || ["input", "change", "click", "blur"];
      for (const type of types) {
        try {
          element.dispatchEvent(new Event(type, { bubbles: true }));
        } catch {
        }
      }
    }
    function simulateHumanClick(element) {
      if (!element) return;
      const options = { view: window, bubbles: true, cancelable: true, buttons: 1 };
      try {
        element.dispatchEvent(new MouseEvent("mousedown", options));
        element.dispatchEvent(new MouseEvent("mouseup", options));
        element.dispatchEvent(new MouseEvent("click", options));
      } catch {
      }
    }
    function activateElementOnce(element) {
      if (!element || element.dataset?.Moeen2Clicked === "true") return;
      try {
        element.dataset.Moeen2Clicked = "true";
        setTimeout(() => {
          if (element && element.dataset) delete element.dataset.Moeen2Clicked;
        }, 1e4);
      } catch {
      }
      try {
        if (typeof element.click === "function") {
          element.click();
          return;
        }
      } catch {
      }
      try {
        element.dispatchEvent(new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
        }));
      } catch {
      }
    }
    function lockActionElement(element) {
      if (!element || element.dataset?.Moeen2Locked === "true") return;
      try {
        element.dataset.Moeen2Locked = "true";
      } catch {
      }
      if ("disabled" in element) {
        try {
          element.disabled = true;
        } catch {
        }
      }
      try {
        element.setAttribute("aria-disabled", "true");
        element.style.pointerEvents = "none";
      } catch {
      }
    }
    function unlockActionElement(element) {
      if (!element) return;
      try {
        delete element.dataset.Moeen2Locked;
      } catch {
      }
      if ("disabled" in element) {
        try {
          element.disabled = false;
        } catch {
        }
      }
      try {
        element.removeAttribute("aria-disabled");
        element.style.pointerEvents = "";
      } catch {
      }
    }
    function getAutomationActionKey(action) {
      const lessonPath = STEP1_SELECT_IDS.map((id) => getFieldValue(`#${id}`)).filter(Boolean).join("|");
      const pageKey = window.location.origin;
      return `${ACTION_LOCK_PREFIX}:${action}:${pageKey}:${lessonPath || "no-path"}`;
    }
    function tryAcquireActionLock(action, ttlMs) {
      const key = getAutomationActionKey(action);
      const now = Date.now();
      try {
        const previous = JSON.parse(window.sessionStorage.getItem(key) || "null");
        if (previous?.at && now - previous.at < ttlMs) {
          return false;
        }
        window.sessionStorage.setItem(key, JSON.stringify({ at: now }));
      } catch {
        return true;
      }
      return true;
    }
    function releaseActionLock(action) {
      try {
        window.sessionStorage.removeItem(getAutomationActionKey(action));
      } catch {
      }
    }
    function setNativeValue(element, value) {
      if (!element) return;
      try {
        // Use the HTMLTextAreaElement prototype setter directly so React's synthetic
        // event system sees the change as a genuine user input (prevents ghost-save).
        // For non-textarea elements we fall back to the generic HTMLInputElement setter.
        const proto = element instanceof HTMLTextAreaElement
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(element, value);
        } else {
          element.value = value;
        }
      } catch {
        element.value = value;
      }
      // Dispatch native events so React's internal state is updated
      try { element.dispatchEvent(new Event('input', { bubbles: true })); } catch { }
      try { element.dispatchEvent(new Event('change', { bubbles: true })); } catch { }
    }
    function waitForElement(selector, timeoutMs = 6e3, root) {
      return new Promise((resolve, reject) => {
        const deadline = Date.now() + timeoutMs;
        const scope = root || document;
        function check() {
          const element = scope.querySelector(selector);
          if (element) {
            resolve(element);
            return;
          }
          if (Date.now() >= deadline) {
            reject(new Error(`Element not found: ${selector}`));
            return;
          }
          setTimeout(check, 100);
        }
        check();
      });
    }
    function waitForOptions(selectId, timeoutMs = 7e3) {
      return new Promise((resolve) => {
        const deadline = Date.now() + timeoutMs;
        function check() {
          const element = document.getElementById(selectId);
          if (element && element.options && element.options.length > 1) {
            resolve(element);
            return;
          }
          if (Date.now() >= deadline) {
            resolve(element || null);
            return;
          }
          setTimeout(check, 120);
        }
        check();
      });
    }
    function getVisibleElements(selector, root) {
      const scope = root || document;
      return Array.from(scope.querySelectorAll(selector)).filter(isTrulyVisible);
    }
    function getFieldValue(selector, root) {
      const scope = root || document;
      const element = scope.querySelector(selector);
      if (!element) return "";
      return typeof element.value === "string" ? element.value.trim() : "";
    }
    function getLessonFormRoot() {
      const prioritizedSelectors = [
        "#divSecondLessonDetailsPage",
        "#mainPage",
        "#divLessonDetailsPages form",
        "#divLessonDetailsPages",
        "form"
      ];
      for (const selector of prioritizedSelectors) {
        const candidates = Array.from(document.querySelectorAll(selector));
        const visibleCandidate = candidates.find(isTrulyVisible);
        if (visibleCandidate) return visibleCandidate;
      }
      return document;
    }
    function getElementLabel(element) {
      if (!element) return "";
      return [
        element.innerText,
        element.textContent,
        element.value,
        element.getAttribute && element.getAttribute("aria-label"),
        element.getAttribute && element.getAttribute("title")
      ].filter(Boolean).join(" ").trim();
    }
    function findElementByText(selector, text, root) {
      const elements = getVisibleElements(selector, root);
      return elements.find((element) => getElementLabel(element).includes(text)) || null;
    }
    function findPreferredElement(strategy) {
      const root = strategy.root || document;
      const textSelector = strategy.textSelector || 'button, a, .btn, [role="button"], input[type="button"], input[type="submit"]';
      for (const id of strategy.ids || []) {
        const element = root.getElementById ? root.getElementById(id) : document.getElementById(id);
        if (isTrulyVisible(element)) return element;
      }
      for (const selector of strategy.attributes || []) {
        const element = root.querySelector(selector);
        if (isTrulyVisible(element)) return element;
      }
      for (const selector of strategy.classes || []) {
        const element = root.querySelector(selector);
        if (isTrulyVisible(element)) return element;
      }
      for (const text of strategy.texts || []) {
        const element = findElementByText(textSelector, text, root);
        if (element) return element;
      }
      return null;
    }
    function ensureCheckboxChecked(checkbox) {
      if (!checkbox || checkbox.disabled) return false;
      if (checkbox.checked) return true;
      const clickTarget = getCheckboxActionElement(checkbox);
      try {
        checkbox.focus();
      } catch {
      }
      if (clickTarget) {
        simulateHumanClick(clickTarget);
      } else {
        simulateHumanClick(checkbox);
      }
      checkbox.checked = true;
      triggerEvents(checkbox, ["input", "change", "click", "blur"]);
      return checkbox.checked;
    }
    function getCheckboxActionElement(checkbox) {
      if (!checkbox) return null;
      if (isTrulyVisible(checkbox)) return checkbox;
      if (checkbox.id) {
        const linkedLabel = document.querySelector(`label[for="${CSS.escape(checkbox.id)}"]`);
        if (isTrulyVisible(linkedLabel)) return linkedLabel;
      }
      const parentLabel = checkbox.closest("label");
      if (isTrulyVisible(parentLabel)) return parentLabel;
      const clickableWrapper = checkbox.closest(".form-check, .checkbox, .radio, .card, .list-group-item, li, div");
      if (isTrulyVisible(clickableWrapper)) return clickableWrapper;
      return checkbox;
    }
    function isCheckboxUsable(checkbox) {
      if (!checkbox || checkbox.disabled) return false;
      if (checkbox.closest(".modal")) return false;
      if (SAVE_LATER_PATTERN.test(checkbox.id || "") || SAVE_LATER_PATTERN.test(checkbox.name || "")) return false;
      const clickTarget = getCheckboxActionElement(checkbox);
      return Boolean(clickTarget && isTrulyVisible(clickTarget));
    }
    function ensureCheckboxGroupSelection(selector, root) {
      const scope = root || document;
      const checkboxes = Array.from(scope.querySelectorAll(selector)).filter(isCheckboxUsable);
      if (!checkboxes.length) return false;
      if (checkboxes.some((checkbox) => checkbox.checked)) return true;
      return ensureCheckboxChecked(checkboxes[0]);
    }
    async function selectLastOption(selectElement) {
      if (!selectElement || !selectElement.options || selectElement.options.length <= 1) return false;

      // Use the native HTMLSelectElement prototype setter so React's internal fiber
      // state sees this as a genuine user-driven change (prevents ghost-reset on
      // the Next button click).
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype, 'value'
      )?.set;
      const targetValue = selectElement.options[selectElement.options.length - 1].value;
      if (nativeSetter) {
        nativeSetter.call(selectElement, targetValue);
      } else {
        selectElement.selectedIndex = selectElement.options.length - 1;
      }

      // Dispatch bubbling events so React's synthetic system re-reads the value.
      try { selectElement.dispatchEvent(new Event('input', { bubbles: true })); } catch { }
      try { selectElement.dispatchEvent(new Event('change', { bubbles: true })); } catch { }
      try { selectElement.dispatchEvent(new Event('blur', { bubbles: true })); } catch { }

      // Also call the onchange handler if the page assigned one directly.
      if (typeof selectElement.onchange === 'function') {
        try { selectElement.onchange(); } catch { }
      }
      return true;
    }
    function isMultiLessonMode(scope = document) {
      const isMulti = scope.querySelector("#IsMultiLectuer");
      if (isMulti && isMulti.value === "true") return true;
      return scope.querySelectorAll(".lesson-info-card").length > 1;
    }
    function buildResult(ok, message, extra) {
      return { ok, message, ...extra || {} };
    }
    // In-memory resource toggle state — the single source of truth.
    // Initialized from localStorage at load. Never read from DOM (avoids hidden-checkbox unreliability).
    var _Moeen2ResEnabled = (function () {
      var state = { activity: true, homework: true, exam: true, enrichment: true };
      try {
        for (var _k in state) {
          var _v = localStorage.getItem('Moeen-2_res_' + _k);
          if (_v !== null) state[_k] = (_v !== 'false');
        }
      } catch (_) { }
      return state;
    })();
    // Returns true if a resource type is enabled.
    function getResourceEnabled(key) {
      return _Moeen2ResEnabled.hasOwnProperty(key) ? _Moeen2ResEnabled[key] : true;
    }
    // Persists a toggle change to both the JS state and localStorage.
    function setResourceEnabled(key, value) {
      _Moeen2ResEnabled[key] = Boolean(value);
      try { localStorage.setItem('Moeen-2_res_' + key, String(Boolean(value))); } catch (_) { }
    }
    async function waitForValue(getValue, timeoutMs = 6e3, intervalMs = 150) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const value = getValue();
        if (value) return value;
        await sleep(intervalMs);
      }
      return null;
    }

    // src/content/ui-panel.js
    var controlPanelHandlers = {
      start: async () => {
      },
      startAI: async () => {
      },
      startQuick: async () => {
      }
    };
    var removeUiTimer = null;
    function setControlPanelHandlers(handlers) {
      controlPanelHandlers = { ...controlPanelHandlers, ...handlers || {} };
    }
    function clearUiRemoval() {
      if (removeUiTimer) {
        clearTimeout(removeUiTimer);
        removeUiTimer = null;
      }
    }
    function removeControlPanel(delayMs = 0) {
      clearUiRemoval();
      const removeNow = () => {
        const container = document.getElementById(UI_IDS.container);
        if (container) container.remove();
      };
      if (delayMs > 0) {
        removeUiTimer = setTimeout(removeNow, delayMs);
        return;
      }
      removeNow();
    }
    function getControlPanel() {
      return document.getElementById(UI_IDS.container);
    }
    function getPrimaryButton() {
      return document.getElementById(UI_IDS.primary);
    }
    function getAdvancedButton() {
      return document.getElementById(UI_IDS.advanced);
    }
    function updateControlStatus(message, tone) {
      const status = document.getElementById(UI_IDS.status);
      if (!status) return;
      const dot = status.querySelector(".Moeen-2-status-dot");
      const text = status.querySelector(".Moeen-2-status-text");
      if (text) text.textContent = message;
      const toneMap = {
        error: { dot: "#c0392b", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.22)", color: "#7a1a10" },
        success: { dot: "#1a9448", bg: "rgba(26,148,72,0.08)", border: "rgba(26,148,72,0.22)", color: "#0e5c2e" },
        warning: { dot: "#c87f0a", bg: "rgba(200,127,10,0.08)", border: "rgba(200,127,10,0.22)", color: "#7a4d05" },
        info: { dot: "#1a6fd4", bg: "rgba(26,111,212,0.08)", border: "rgba(26,111,212,0.22)", color: "#0f4b99" },
        default: { dot: "#8a8a8a", bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)", color: "#555" }
      };
      const t = toneMap[tone] || toneMap.default;
      if (dot) dot.style.background = t.dot;
      status.style.background = t.bg;
      status.style.borderColor = t.border;
      status.style.color = t.color;
      status.dataset.tone = tone || "info";
    }
    function getAIButton() {
      return document.getElementById(UI_IDS.aiBtn);
    }
    function getQuickButton() {
      return document.getElementById(UI_IDS.quickBtn);
    }
    function setButtonsDisabled(disabled) {
      const primary = getPrimaryButton();
      const advanced = getAdvancedButton();
      const aiBtnEl = getAIButton();
      if (primary) {
        primary.disabled = disabled;
        primary.style.opacity = disabled ? "0.6" : "1";
        primary.style.cursor = disabled ? "not-allowed" : "pointer";
      }
      if (aiBtnEl) {
        aiBtnEl.disabled = disabled;
        aiBtnEl.style.opacity = disabled ? "0.6" : "1";
        aiBtnEl.style.cursor = disabled ? "not-allowed" : "pointer";
      }
      const quickBtnEl = getQuickButton();
      if (quickBtnEl) {
        quickBtnEl.disabled = disabled;
        quickBtnEl.style.opacity = disabled ? "0.6" : "1";
        quickBtnEl.style.cursor = disabled ? "not-allowed" : "pointer";
      }
      if (advanced) {
        advanced.disabled = disabled;
        advanced.style.opacity = disabled ? "0.45" : "1";
        advanced.style.cursor = disabled ? "not-allowed" : "pointer";
      }
    }
    function updatePrimaryButton(label, tone) {
      const primary = getPrimaryButton();
      const iconEl = primary && primary.querySelector(".Moeen-2-btn-icon");
      if (!primary) return;
      const toneMap = {
        error: { bg: "#c0392b", icon: errorIconSVG() },
        success: { bg: "#1a9448", icon: checkIconSVG() },
        warning: { bg: "#c87f0a", icon: warningIconSVG() },
        loading: { bg: "#1a6fd4", icon: clockIconSVG() },
        default: { bg: "#1a6fd4", icon: playIconSVG() }
      };
      const t = toneMap[tone] || toneMap.default;
      primary.style.background = t.bg;
      if (iconEl) iconEl.innerHTML = t.icon;
      const labelEl = primary.querySelector(".Moeen-2-btn-label");
      if (labelEl) labelEl.textContent = label;
    }
    var SVG = (d, opts = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0" ${opts}>${d}</svg>`;
    var playIconSVG = () => SVG('<polygon points="5 3 19 12 5 21 5 3"/>');
    var checkIconSVG = () => SVG('<polyline points="20 6 9 17 4 12"/>');
    var clockIconSVG = () => SVG('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>');
    var errorIconSVG = () => SVG('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>');
    var warningIconSVG = () => SVG('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>');
    var aiIconSVG = () => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><path d="M12 2a4 4 0 014 4v1a1 1 0 01-1 1H9a1 1 0 01-1-1V6a4 4 0 014-4z"/><path d="M9 8v1a3 3 0 006 0V8"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="18" x2="9" y2="22"/><line x1="15" y1="18" x2="15" y2="22"/><line x1="12" y1="16" x2="12" y2="22"/></svg>`;
    var gearIconSVG = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;flex-shrink:0"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>`;
    function injectControlPanel() {
      removeControlPanel();
    }
    function applyButtonStyle(button, background) {
      button.style.cssText = [
        `background:${background}`,
        "color:#fff",
        "border:none",
        "border-radius:10px",
        "padding:11px 14px",
        "font-size:14px",
        "font-weight:700",
        "width:100%",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "gap:8px",
        "cursor:pointer",
        "font-family:Cairo,Segoe UI,Tahoma,sans-serif",
        "transition:opacity .15s,transform .1s"
      ].join(";");
      button.onmousedown = () => {
        button.style.transform = "scale(0.98)";
      };
      button.onmouseup = () => {
        button.style.transform = "";
      };
      button.onmouseleave = () => {
        button.style.transform = "";
      };
    }
    function applySecondaryButtonStyle(button) {
      button.style.cssText = [
        "background:rgba(0,0,0,0.04)",
        "color:#374151",
        "border:0.5px solid rgba(0,0,0,0.14)",
        "border-radius:10px",
        "padding:10px 14px",
        "font-size:13px",
        "font-weight:600",
        "width:100%",
        "cursor:pointer",
        "font-family:Cairo,Segoe UI,Tahoma,sans-serif",
        "transition:background .15s,transform .1s"
      ].join(";");
      button.onmouseenter = () => {
        button.style.background = "rgba(0,0,0,0.07)";
      };
      button.onmouseleave = () => {
        button.style.background = "rgba(0,0,0,0.04)";
        button.style.transform = "";
      };
      button.onmousedown = () => {
        button.style.transform = "scale(0.98)";
      };
      button.onmouseup = () => {
        button.style.transform = "";
      };
    }

    // src/content/page-state.js
    var findFinalSaveButton = () => null;
    function setFinalSaveButtonDetector(detector) {
      findFinalSaveButton = typeof detector === "function" ? detector : () => null;
    }
    function isLessonManagementPath(pathname) {
      return /\/SchoolSchedule\/Schedule\/(?:ManageLecture|EditLecture|DeleteLecture)(?:\/|$)/i.test(
        pathname || window.location.pathname
      );
    }
    function detectPageState() {
      var isLessonManagementUrl = isLessonManagementPath();
      var isScheduleUrl = /^\/SchoolSchedule(?:\/Schedule(?:\/TeacherSchedule)?)?\/?$/i.test(window.location.pathname) ||
        /\/services\/(?:my[-_/]?)?schedule(?:\/|$)/i.test(window.location.pathname);
      var hasTimeTable = Boolean(
        document.querySelector('.calendar-table, .table-schedule, .schedule-table, .fc-view, .timetable, .scheduler-table')
      );
      if (!isLessonManagementUrl && (isScheduleUrl || hasTimeTable)) return FLOW_STATES.DASHBOARD;
      const setupVisible = STEP1_SELECT_IDS.some((id) => isTrulyVisible(document.getElementById(id)));
      if (setupVisible) return FLOW_STATES.STEP1;
      const hasLessonForm = getVisibleElements("textarea").length > 0 || getVisibleElements('[contenteditable="true"]').length > 0 || Boolean(findFinalSaveButton());
      if (hasLessonForm) return FLOW_STATES.STEP2;
      return FLOW_STATES.IDLE;
    }

    // src/content/dashboard-ui.js
    var dashboardInjected = false;
    var dashboardLessonCount = 0;
    var dashboardScanRunning = false;
    var dashboardPollTimer = null;
    var scheduleRouteWatcher = null;
    var presenceBadgeState = "active";
    var subscriptionBadgeData = null;
    var subscriptionAccessAllowed = false;
    var subscriptionAccessFailure = null;
    var dashboardSelectionCache = new Map();
    // One AI request per lesson at a time. This lets selection-time prefetch and
    // batch-time prefetch share the same promise instead of calling n8n twice.
    var aiPrefetchInFlight = new Map();
    var aiPrefetchActiveCount = 0;
    var aiPrefetchWaiters = [];
    var backendBatchPolling = false;

    async function fetchLessonTreeOptions(subjectId, subjectName) {
      var optionsArray = [];
      const subjectData = await getLocalSubjectData(subjectId, subjectName);
      if (subjectData) {
        // groups هي array of arrays: groups[chapter][lesson] = {id, info:{compositeId,name,...}}
        // نعمل flatten عشان نمشي على كل درس لوحده بغض النظر عن العمق.
        var pushedFromGroups = 0;
        if (subjectData.groups && Array.isArray(subjectData.groups)) {
          subjectData.groups.forEach(group => {
            var lessons = Array.isArray(group) ? group : [group];
            lessons.forEach(lesson => {
              if (lesson && lesson.info && lesson.info.compositeId && lesson.info.name) {
                optionsArray.push({
                  value: lesson.info.compositeId,
                  text: lesson.info.name,
                  level: '1'
                });
                pushedFromGroups++;
              }
            });
          });
        }
        // لو الـ groups فاضية (76% من الـ courses كده) نوقع على rawLessonsList كـ fallback.
        if (pushedFromGroups === 0 && Array.isArray(subjectData.rawLessonsList)) {
          subjectData.rawLessonsList.forEach(lesson => {
            if (lesson && lesson.id && lesson.name) {
              optionsArray.push({ value: lesson.id, text: lesson.name, level: '1' });
            }
          });
        }
      }
      // [Moeen-2 HYBRID] Live fallback: when local JSON yielded no real lessons,
      // call the Madrasati GetGoalLessonSubject endpoint directly. Confirmed via network capture.
      if (optionsArray.length === 0 && subjectId) {
        console.log('[Moeen-2 HYBRID] Local cache miss for subjectId=', subjectId, '→ trying live GetGoalLessonSubject');
        const liveLessons = await fetchGoalLessonSubjectLive(subjectId);
        if (Array.isArray(liveLessons) && liveLessons.length > 0) {
          for (const lesson of liveLessons) {
            if (lesson && lesson.info && lesson.info.compositeId && lesson.info.name) {
              optionsArray.push({
                value: lesson.info.compositeId,
                text: lesson.info.name,
                level: '1'
              });
            }
          }
        }
      }
      // Diagnostic log: if STILL no real lessons after both local + live attempts,
      // print the offending subjectId + subjectName for further investigation.
      if (optionsArray.length === 0) {
        console.warn('[Moeen-2] EMPTY LESSON LIST for card (after local + live) →', {
          subjectId: subjectId,
          subjectName: subjectName,
          subjectDataFound: !!subjectData,
          subjectDataHasGroups: !!(subjectData && subjectData.groups && subjectData.groups.length),
          subjectDataHasRaw: !!(subjectData && subjectData.rawLessonsList && subjectData.rawLessonsList.length)
        });
      }
      return optionsArray;
    }

    function createDashboardSelectDropdown(lessonId, options) {
      var select = document.createElement("select");
      select.className = "Moeen-2-dashboard-select";
      select.dataset.lessonId = lessonId;
      select.setAttribute("data-lesson-token", lessonId);
      select.style.cssText = [
        "display:block",
        "width:90%",
        "margin:8px auto",
        "padding:5px 8px",
        "font-size:12px",
        "font-family:Cairo,Segoe UI,Tahoma,sans-serif",
        "border:1.5px solid rgba(26,111,212,0.35)",
        "border-radius:4px",
        "background:#fff",
        "color:#16324f",
        "cursor:pointer",
        "direction:rtl",
        "outline:none",
        "transition:border-color .2s,box-shadow .2s"
      ].join(";");

      var defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "\u0627\u062E\u062A\u0631 \u0627\u0644\u062F\u0631\u0633..."; // اختر الدرس...
      select.appendChild(defaultOpt);

      for (var opt of options) {
        var optEl = document.createElement("option");
        optEl.value = opt.value;
        optEl.textContent = opt.text;
        if (opt.level) optEl.dataset.level = opt.level;
        select.appendChild(optEl);
      }

      if (dashboardSelectionCache.has(lessonId)) {
        select.value = dashboardSelectionCache.get(lessonId);
        if (select.value) {
          select.style.borderColor = "#1a9448";
          select.style.background = "rgba(26,148,72,0.04)";
        }
      }

      // Madrasati makes the entire lesson card clickable. Without isolating
      // these events, opening/selecting this dropdown bubbles to the card and
      // triggers its yes/no navigation warning. Stopping propagation preserves
      // the select's native behavior because no default action is cancelled.
      function isolateDropdownInteraction(event) {
        event.stopPropagation();
      }
      [
        "pointerdown", "pointerup",
        "mousedown", "mouseup",
        "click", "dblclick",
        "touchstart", "touchend",
        "keydown", "keyup"
      ].forEach(function (eventName) {
        select.addEventListener(eventName, isolateDropdownInteraction, true);
      });

      select.addEventListener("focus", function () {
        select.style.borderColor = "#1a6fd4";
        select.style.boxShadow = "0 0 0 3px rgba(26,111,212,0.12)";
      });
      select.addEventListener("blur", function () {
        select.style.borderColor = "rgba(26,111,212,0.35)";
        select.style.boxShadow = "none";
      });
      select.addEventListener("change", function (event) {
        event.stopPropagation();
        if (select.value) {
          select.style.borderColor = "#1a9448";
          select.style.background = "rgba(26,148,72,0.04)";
        } else {
          select.style.borderColor = "rgba(26,111,212,0.35)";
          select.style.background = "#fff";
        }

        // Madrasati can render responsive copies of the same lesson card.
        // Keep every copy in sync so the user selects each lecture only once.
        var lessonToken = select.getAttribute("data-lesson-token");
        if (lessonToken) {
          if (select.value) dashboardSelectionCache.set(lessonToken, select.value);
          else dashboardSelectionCache.delete(lessonToken);
          document.querySelectorAll(".Moeen-2-dashboard-select").forEach(function (sibling) {
            if (sibling === select || sibling.getAttribute("data-lesson-token") !== lessonToken) return;
            sibling.value = select.value;
            sibling.style.borderColor = select.value ? "#1a9448" : "rgba(26,111,212,0.35)";
            sibling.style.background = select.value ? "rgba(26,148,72,0.04)" : "#fff";
          });
        }

        // Start preparing the generated lesson text as soon as the teacher
        // selects a lesson. In most cases it will already be cached by the time
        // "prepare" is clicked. The batch path below safely joins this request.
        if (!BACKEND_PREPARATION_ENABLED && subscriptionAccessAllowed && select.value && select.value !== "AI_AUTO") {
          var selectedDiv = select.closest('div[data-data]') || select.parentElement;
          void prefetchAILessonDataForCard({
            select: select,
            div: selectedDiv,
            selection: {
              treeValue: select.value,
              treeText: select.options[select.selectedIndex].text
            }
          });
        }
        updateDashboardCounter();
      });

      return select;
    }

    function updateDashboardCounter() {
      var allSelects = document.querySelectorAll(".Moeen-2-dashboard-select");
      var allTokens = new Set();
      var selectedTokens = new Set();
      for (var select of allSelects) {
        var token = select.getAttribute("data-lesson-token") || select.dataset.lessonId || String(allTokens.size);
        allTokens.add(token);
        if (select.value) selectedTokens.add(token);
      }
      var counter = document.getElementById("Moeen-2-dashboard-counter");
      if (counter) counter.textContent = selectedTokens.size + " من " + allTokens.size;

      var anyResource = Object.keys(_Moeen2ResEnabled).some(function (key) {
        return _Moeen2ResEnabled[key];
      });
      var saveBtn = document.getElementById("Moeen-2-dashboard-save");
      if (saveBtn) {
        saveBtn.disabled = !subscriptionAccessAllowed || selectedTokens.size === 0 || !anyResource;
        saveBtn.style.opacity = saveBtn.disabled ? "0.5" : "1";
        saveBtn.style.cursor = saveBtn.disabled ? "not-allowed" : "pointer";
        saveBtn.dataset.ready = String(!saveBtn.disabled);
      }
      var hint = document.getElementById("Moeen-2-res-hint");
      if (hint) hint.style.display = anyResource ? "none" : "inline";
    }

    function isTopLevelPage() {
      try { return window.top === window.self; } catch (_) { return false; }
    }

    function ensureHadarSurfaceStyles() {
      if (!document.getElementById("Moeen-2-dashboard-styles")) {
        var style = document.createElement("style");
        style.id = "Moeen-2-dashboard-styles";
        style.textContent = [
          "@keyframes hadarPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.72)}}",
          "#Moeen-2-dashboard-panel{position:fixed;right:18px;bottom:18px;z-index:2147483647;width:min(560px,calc(100vw - 36px));box-sizing:border-box;background:#fff;border:1px solid rgba(14,122,94,.22);border-radius:16px;box-shadow:0 16px 48px rgba(15,23,42,.22);padding:14px;font-family:Cairo,Segoe UI,Tahoma,sans-serif;direction:rtl;color:#16324f}",
          "#Moeen-2-dashboard-panel *{box-sizing:border-box}",
          ".Moeen-2-dashboard-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
          ".Moeen-2-dashboard-brand{display:flex;align-items:center;gap:9px;margin-left:auto}",
          ".Moeen-2-dashboard-logo{width:34px;height:34px;border-radius:10px;box-shadow:0 4px 12px rgba(14,122,94,.2)}",
          ".Moeen-2-dashboard-title{font-size:16px;font-weight:900;color:#0e7a5e;line-height:1.25}",
          ".Moeen-2-dashboard-subtitle{font-size:10px;color:#718096;margin-top:2px}",
          ".Moeen-2-dashboard-badge{background:#eaf7f2;color:#0e7a5e;border:1px solid #b9dfd1;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700}",
          ".Moeen-2-dashboard-warning{display:flex;align-items:flex-start;gap:7px;background:#fff8e8;border:1px solid #f1d59a;border-radius:9px;padding:7px 9px;margin:10px 0 8px;color:#7a4d05;font-size:11px;line-height:1.6}",
          ".Moeen-2-dashboard-status-row{display:flex;align-items:flex-start;gap:7px;margin:7px 1px 10px}",
          "#Moeen-2-dashboard-status-dot{width:7px;height:7px;border-radius:50%;background:#1a6fd4;margin-top:6px;flex:0 0 auto;animation:hadarPulse 1.6s ease-in-out infinite}",
          "#Moeen-2-dashboard-status{font-size:12px;line-height:1.7;color:#6b7c93}",
          ".Moeen-2-resources{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px}",
          ".Moeen-2-resources-label{font-size:11px;font-weight:800;color:#475569;margin-left:2px}",
          ".Moeen-2-res-pill{border:1px solid #d9e5e1;border-radius:999px;padding:5px 10px;background:#f8fbfa;font:700 11px Cairo,Segoe UI,Tahoma,sans-serif;cursor:pointer;color:#64748b}",
          ".Moeen-2-res-pill[data-on=true]{background:#eaf7f2;border-color:#8dccb5;color:#0e7a5e}",
          "#Moeen-2-dashboard-save{width:100%;border:0;border-radius:10px;background:linear-gradient(135deg,#0e7a5e,#075f49);color:#fff;padding:10px 14px;font:800 13px Cairo,Segoe UI,Tahoma,sans-serif}",
          "#Moeen-2-dashboard-save[data-ready=true]{box-shadow:0 6px 18px rgba(14,122,94,.3)}",
          "#hadar-presence-badge{position:fixed;right:18px;bottom:18px;z-index:2147483647;display:flex;align-items:center;gap:9px;border:1px solid rgba(14,122,94,.24);border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 9px 28px rgba(15,23,42,.18);padding:7px 12px 7px 8px;font-family:Cairo,Segoe UI,Tahoma,sans-serif;direction:rtl;color:#16324f;pointer-events:none;backdrop-filter:blur(12px)}",
          "#hadar-presence-badge img{width:28px;height:28px;border-radius:8px}",
          ".hadar-presence-copy{display:flex;flex-direction:column;line-height:1.2;text-align:right}",
          ".hadar-presence-title{font-size:11px;font-weight:900;color:#0e7a5e}",
          ".hadar-presence-sub{font-size:9px;color:#718096;margin-top:2px}",
          ".hadar-presence-dot{width:7px;height:7px;border-radius:50%;background:#16a34a;animation:hadarPulse 1.8s ease-in-out infinite}",
          "#hadar-presence-badge[data-state=login] .hadar-presence-dot{background:#d97706}",
          "#hadar-presence-badge[data-state=expired] .hadar-presence-dot{background:#dc2626}",
          "#hadar-presence-badge[data-state=checking] .hadar-presence-dot{background:#2563eb}",
          "#hadar-subscription-exception{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.5);font-family:Cairo,Segoe UI,Tahoma,sans-serif;direction:rtl}",
          ".hadar-exception-card{position:relative;width:min(430px,100%);background:#fff;border:1px solid #fecaca;border-radius:18px;box-shadow:0 24px 70px rgba(15,23,42,.32);padding:24px;color:#16324f;text-align:right}",
          ".hadar-exception-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:#fff1f2;color:#be123c;font-size:24px;margin-bottom:13px}",
          ".hadar-exception-title{font-size:18px;font-weight:900;color:#991b1b;margin-bottom:7px}",
          ".hadar-exception-message{font-size:13px;line-height:1.8;color:#64748b;margin-bottom:16px}",
          ".hadar-exception-actions{display:flex;gap:8px;flex-wrap:wrap}",
          ".hadar-exception-action{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:9px;padding:9px 14px;font:800 12px Cairo,Segoe UI,Tahoma,sans-serif;text-decoration:none;cursor:pointer}",
          ".hadar-exception-subscribe{background:#0e7a5e;color:#fff}",
          ".hadar-exception-retry{background:#eef2f7;color:#334155}",
          ".hadar-exception-close{position:absolute;left:12px;top:10px;border:0;background:transparent;color:#94a3b8;font-size:22px;cursor:pointer}",
          ".Moeen-2-dashboard-select{position:relative!important;z-index:10!important;display:block!important;width:calc(100% - 12px)!important;min-width:120px!important;margin:7px 6px 3px!important;padding:6px!important;border:1px solid #8dccb5!important;border-radius:7px!important;background:#fff!important;color:#16324f!important;font:600 11px Cairo,Segoe UI,Tahoma,sans-serif!important;direction:rtl!important}"
        ].join("\n");
        (document.head || document.documentElement).appendChild(style);
      }
    }

    function removePresenceBadge() {
      var badge = document.getElementById("hadar-presence-badge");
      if (badge) badge.remove();
    }

    function getRemainingSubscriptionDays(endsAt, providedDays) {
      if (typeof providedDays === "number" && Number.isFinite(providedDays) && providedDays > 0) {
        return Math.ceil(providedDays);
      }
      var endTime = Date.parse(endsAt || "");
      if (!Number.isFinite(endTime)) return null;
      var remainingMs = endTime - Date.now();
      return remainingMs > 0 ? Math.max(1, Math.ceil(remainingMs / 86400000)) : 0;
    }

    function getSubscriptionBadgeCopy(data) {
      if (!data) {
        return { title: "حضر يعمل", sub: "جاهز على منصة مدرستي", panel: "الاشتراك نشط" };
      }

      var usage = data.usage || {};
      var remainingToday = usage.lessons_remaining_today;
      var dailyCopy = remainingToday === null
        ? "تحضير غير محدود اليوم"
        : (typeof remainingToday === "number" ? remainingToday + " درس متبقٍ اليوم" : "الاشتراك نشط");

      if (data.is_in_trial) {
        var trialDays = getRemainingSubscriptionDays(data.trial_ends_at, data.trial_days_remaining);
        var trialDaysCopy = trialDays === null ? "التجربة نشطة" : "متبقي " + trialDays + " يوم";
        return {
          title: "حضر • تجربة مجانية",
          sub: trialDaysCopy + " • " + dailyCopy,
          panel: trialDays === null ? "التجربة نشطة" : "التجربة: " + trialDays + " يوم"
        };
      }

      var plan = data.plan || {};
      var subscriptionDays = getRemainingSubscriptionDays(
        data.subscription_ends_at,
        data.subscription_days_remaining
      );
      var subscriptionDaysCopy = subscriptionDays === null
        ? "الاشتراك نشط"
        : "متبقي " + subscriptionDays + " يوم";
      return {
        title: "حضر • " + (plan.name || "اشتراك نشط"),
        sub: subscriptionDaysCopy + " • " + dailyCopy,
        panel: subscriptionDaysCopy
      };
    }

    function updateDashboardSubscriptionBadge() {
      var badge = document.getElementById("Moeen-2-subscription-badge");
      if (!badge) return;
      var copy = getSubscriptionBadgeCopy(subscriptionBadgeData);
      badge.textContent = copy.panel;
      badge.title = copy.sub;
    }

    function getSubscriptionExceptionCopy(result) {
      var code = result && result.code;
      if (code === "quota_exceeded") {
        return {
          title: "اكتمل حد التحضير اليومي",
          message: (result && result.message) || "لا توجد تحضيرات متبقية في خطتك اليوم. يمكنك المحاولة مجدداً غداً أو ترقية الخطة.",
          showSubscribe: true
        };
      }
      if (code === "verification_failed") {
        return {
          title: "تعذّر التحقق من الاشتراك",
          message: "لن يبدأ حضر التحضير حتى يتم التأكد من حالة اشتراكك. تحقق من الاتصال ثم أعد المحاولة.",
          showSubscribe: false
        };
      }
      if (code === "auth_required") {
        return {
          title: "يلزم تسجيل الدخول",
          message: "سجّل الدخول من أيقونة إضافة حضر ثم أعد المحاولة.",
          showSubscribe: false
        };
      }
      return {
        title: "التحضير غير متاح",
        message: (result && result.message) || "لا توجد لديك خطة أو فترة تجريبية نشطة، أو أن اشتراكك انتهى. اشترك للمتابعة.",
        showSubscribe: true
      };
    }

    function showSubscriptionAccessException(result) {
      subscriptionAccessAllowed = false;
      subscriptionAccessFailure = result || { code: "subscription_required" };
      injectPresenceBadge("expired");
      updateDashboardCounter();
      if (!isTopLevelPage()) return;

      ensureHadarSurfaceStyles();
      var existing = document.getElementById("hadar-subscription-exception");
      if (existing) existing.remove();
      var copy = getSubscriptionExceptionCopy(subscriptionAccessFailure);
      var overlay = document.createElement("div");
      overlay.id = "hadar-subscription-exception";
      var card = document.createElement("section");
      card.className = "hadar-exception-card";
      var close = document.createElement("button");
      close.type = "button";
      close.className = "hadar-exception-close";
      close.setAttribute("aria-label", "إغلاق");
      close.textContent = "×";
      close.addEventListener("click", function () { overlay.remove(); });
      var icon = document.createElement("div");
      icon.className = "hadar-exception-icon";
      icon.textContent = "🔒";
      var title = document.createElement("div");
      title.className = "hadar-exception-title";
      title.textContent = copy.title;
      var message = document.createElement("div");
      message.className = "hadar-exception-message";
      message.textContent = copy.message;
      var actions = document.createElement("div");
      actions.className = "hadar-exception-actions";
      var retry = document.createElement("button");
      retry.type = "button";
      retry.className = "hadar-exception-action hadar-exception-retry";
      retry.textContent = "إعادة التحقق";
      retry.addEventListener("click", function () { window.location.reload(); });
      actions.appendChild(retry);
      if (copy.showSubscribe) {
        var subscribe = document.createElement("a");
        subscribe.className = "hadar-exception-action hadar-exception-subscribe";
        subscribe.href = "https://haderedu.com/checkout";
        subscribe.target = "_blank";
        subscribe.rel = "noopener noreferrer";
        subscribe.textContent = "عرض الخطط";
        actions.prepend(subscribe);
      }
      card.append(close, icon, title, message, actions);
      overlay.appendChild(card);
      document.documentElement.appendChild(overlay);
    }

    async function checkCurrentSubscriptionAccess() {
      subscriptionAccessAllowed = false;
      try {
        var authData = await getLocal([AUTH_SESSION_KEY]);
        var session = authData[AUTH_SESSION_KEY];
        if (!session || !session.token) {
          return { ok: false, code: "auth_required", message: "يلزم تسجيل الدخول إلى حضر." };
        }

        var response = await new Promise(function (resolve, reject) {
          chrome.runtime.sendMessage({
            action: "GET_SUBSCRIPTION_CURRENT",
            token: session.token,
            tokenType: session.tokenType || "Bearer"
          }, function (result) {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            if (!result || !result.ok) {
              reject(new Error(result && result.error ? result.error : "Subscription request failed"));
              return;
            }
            resolve(result);
          });
        });

        var data = response.data || {};
        subscriptionBadgeData = data;
        var activeTrial = data.is_in_trial === true && Boolean(data.plan);
        var activePaidPlan = data.is_subscribed === true && Boolean(data.plan);
        var trialEnd = Date.parse(data.trial_ends_at || "");
        var paidEnd = Date.parse(data.subscription_ends_at || "");
        if (activeTrial && Number.isFinite(trialEnd) && trialEnd <= Date.now()) activeTrial = false;
        if (activePaidPlan && Number.isFinite(paidEnd) && paidEnd <= Date.now()) activePaidPlan = false;

        if (response.status !== 200 || (!activeTrial && !activePaidPlan)) {
          return {
            ok: false,
            code: data.code || (response.status === 401 ? "auth_required" : "subscription_required"),
            message: data.message || "لا توجد لديك خطة أو فترة تجريبية نشطة، أو أن اشتراكك انتهى."
          };
        }

        var remainingToday = data.usage && data.usage.lessons_remaining_today;
        if (data.can_prepare_lesson === false || (typeof remainingToday === "number" && remainingToday <= 0)) {
          return {
            ok: false,
            code: "quota_exceeded",
            message: "اكتمل الحد اليومي للتحضير في خطتك. حاول مجدداً غداً أو قم بترقية الخطة."
          };
        }

        subscriptionAccessAllowed = true;
        subscriptionAccessFailure = null;
        updateDashboardSubscriptionBadge();
        return { ok: true, data: data };
      } catch (error) {
        console.warn("[حضر] Could not verify subscription:", error);
        return { ok: false, code: "verification_failed", message: error && error.message };
      }
    }

    function injectPresenceBadge(state) {
      if (!isTopLevelPage()) return;
      presenceBadgeState = state || presenceBadgeState || "active";
      ensureHadarSurfaceStyles();
      var badge = document.getElementById("hadar-presence-badge");
      if (!badge) {
        badge = document.createElement("aside");
        badge.id = "hadar-presence-badge";
        var logo = document.createElement("img");
        logo.src = chrome.runtime.getURL("logo/logo-48.png");
        logo.alt = "حضر";
        var copy = document.createElement("span");
        copy.className = "hadar-presence-copy";
        var badgeTitle = document.createElement("span");
        badgeTitle.className = "hadar-presence-title";
        var badgeSub = document.createElement("span");
        badgeSub.className = "hadar-presence-sub";
        copy.append(badgeTitle, badgeSub);
        var dot = document.createElement("span");
        dot.className = "hadar-presence-dot";
        badge.append(logo, copy, dot);
        document.documentElement.appendChild(badge);
      }
      badge.dataset.state = presenceBadgeState;
      var title = badge.querySelector(".hadar-presence-title");
      var sub = badge.querySelector(".hadar-presence-sub");
      if (presenceBadgeState === "login") {
        title.textContent = "حضر موجود";
        sub.textContent = "سجّل الدخول من أيقونة الإضافة";
      } else if (presenceBadgeState === "expired") {
        title.textContent = "حضر متوقف مؤقتاً";
        sub.textContent = "يلزم تجديد الاشتراك";
      } else if (presenceBadgeState === "checking") {
        title.textContent = "حضر موجود";
        sub.textContent = "جاري التحقق من الحساب";
      } else {
        var subscriptionCopy = getSubscriptionBadgeCopy(subscriptionBadgeData);
        title.textContent = subscriptionCopy.title;
        sub.textContent = subscriptionCopy.sub;
      }
    }

    function removeDashboardUI() {
      var panel = document.getElementById("Moeen-2-dashboard-panel");
      if (panel) panel.remove();
      document.querySelectorAll(".Moeen-2-dashboard-select").forEach(function (select) { select.remove(); });
      dashboardInjected = false;
      dashboardLessonCount = 0;
      if (dashboardPollTimer) {
        clearInterval(dashboardPollTimer);
        dashboardPollTimer = null;
      }
    }

    function injectDashboardPanel() {
      if (!isTopLevelPage()) return;
      removePresenceBadge();
      ensureHadarSurfaceStyles();
      if (document.getElementById("Moeen-2-dashboard-panel")) return;

      var panel = document.createElement("section");
      panel.id = "Moeen-2-dashboard-panel";

      var head = document.createElement("div");
      head.className = "Moeen-2-dashboard-head";
      var brand = document.createElement("div");
      brand.className = "Moeen-2-dashboard-brand";
      var logo = document.createElement("img");
      logo.className = "Moeen-2-dashboard-logo";
      logo.src = chrome.runtime.getURL("logo/logo-48.png");
      logo.alt = "حضر";
      var titleGroup = document.createElement("div");
      var title = document.createElement("div");
      title.className = "Moeen-2-dashboard-title";
      title.textContent = "حضر";
      var subtitle = document.createElement("div");
      subtitle.className = "Moeen-2-dashboard-subtitle";
      subtitle.textContent = "لوحة التحضير الجماعي";
      titleGroup.append(title, subtitle);
      brand.append(logo, titleGroup);
      var badge = document.createElement("span");
      badge.className = "Moeen-2-dashboard-badge";
      badge.id = "Moeen-2-dashboard-counter";
      badge.textContent = "0 من 0";
      var subscriptionBadge = document.createElement("span");
      subscriptionBadge.className = "Moeen-2-dashboard-badge";
      subscriptionBadge.id = "Moeen-2-subscription-badge";
      head.append(brand, subscriptionBadge, badge);
      updateDashboardSubscriptionBadge();

      var warning = document.createElement("div");
      warning.className = "Moeen-2-dashboard-warning";
      warning.innerHTML = '<span>⚠️</span><span><strong>تنبيه:</strong> منصة مدرستي تسمح بإعداد الحصص لسبعة أيام مستقبلية فقط.</span>';

      var statusRow = document.createElement("div");
      statusRow.className = "Moeen-2-dashboard-status-row";
      var statusDot = document.createElement("span");
      statusDot.id = "Moeen-2-dashboard-status-dot";
      var status = document.createElement("div");
      status.id = "Moeen-2-dashboard-status";
      status.textContent = "جاري فحص الجدول الدراسي...";
      statusRow.append(statusDot, status);

      var resources = document.createElement("div");
      resources.className = "Moeen-2-resources";
      var resourcesLabel = document.createElement("span");
      resourcesLabel.className = "Moeen-2-resources-label";
      resourcesLabel.textContent = "الموارد المضافة:";
      resources.appendChild(resourcesLabel);
      var resourceDefs = [
        { key: "activity", label: "نشاط" },
        { key: "homework", label: "واجب" },
        { key: "exam", label: "اختبار" },
        { key: "enrichment", label: "إثراء" }
      ];
      for (var definition of resourceDefs) {
        (function (resource) {
          var pill = document.createElement("button");
          pill.type = "button";
          pill.className = "Moeen-2-res-pill";
          function renderPill() {
            var isOn = getResourceEnabled(resource.key);
            pill.dataset.on = String(isOn);
            pill.textContent = isOn ? "✓ " + resource.label : resource.label;
          }
          renderPill();
          pill.addEventListener("click", function () {
            var enabled = !getResourceEnabled(resource.key);
            setResourceEnabled(resource.key, enabled);
            renderPill();
            updateDashboardCounter();
          });
          resources.appendChild(pill);
        })(definition);
      }
      var resourceHint = document.createElement("span");
      resourceHint.id = "Moeen-2-res-hint";
      resourceHint.textContent = "اختر مورداً واحداً على الأقل";
      resourceHint.style.cssText = "display:none;color:#b45309;font-size:11px";
      resources.appendChild(resourceHint);

      var saveBtn = document.createElement("button");
      saveBtn.id = "Moeen-2-dashboard-save";
      saveBtn.type = "button";
      saveBtn.disabled = true;
      saveBtn.textContent = "حفظ وبدء التحضير";
      saveBtn.addEventListener("click", async function () {
        if (saveBtn.disabled) return;
        saveBtn.disabled = true;
        saveBtn.textContent = "جاري تحضير الحصص...";
        try {
          await handleDashboardSave();
        } finally {
          saveBtn.textContent = "حفظ وبدء التحضير";
          updateDashboardCounter();
        }
      });

      panel.append(head, warning, statusRow, resources, saveBtn);
      document.documentElement.appendChild(panel);
    }
    // ── Student Report Feature Stubs (to be implemented) ─────────────────────
    function extractAttachedResourceIds() {
      // TODO: Scan the page or stored state for LectureProjectsList / LectureAssignmentsList / LectureExamsList IDs
      // For now returns empty structure
      return { projects: [], assignments: [], exams: [] };
    }

    async function fetchStudentReportForLesson(lessonContext) {
      // lessonContext = { schoolId, timeTableId, classroomId, resourceIds }
      // TODO: Call real Madrasati student report endpoints here
      console.log('[Moeen-2] fetchStudentReportForLesson called with:', lessonContext);
      return {
        lessonTitle: lessonContext.lessonTitle || 'حصة',
        students: [] // placeholder
      };
    }

    function renderStudentReportModal(reportData) {
      // TODO: Create a nice modal showing students + per-resource status
      console.log('[Moeen-2] renderStudentReportModal called with data:', reportData);
      alert('تقرير الطلاب (قيد التطوير):\n' + JSON.stringify(reportData, null, 2));
    }

    // Expose a global trigger for the banner button
    window.showStudentReport = async function () {
      var ids = extractAttachedResourceIds();
      var data = await fetchStudentReportForLesson({ resourceIds: ids });
      renderStudentReportModal(data);
    };

    function updateDashboardStatus(message, tone) {
      var status = document.getElementById("Moeen-2-dashboard-status");
      if (!status) return;
      status.textContent = message;
      var toneColors = {
        info: "#6b7c93",
        success: "#1a9448",
        error: "#c0392b",
        warning: "#c87f0a",
        loading: "#1a6fd4"
      };
      var color = toneColors[tone] || toneColors.info;
      status.style.color = color;
      var dot = document.getElementById("Moeen-2-dashboard-status-dot");
      if (dot) {
        dot.style.background = color;
        dot.style.animationPlayState = (tone === "success" || tone === "error") ? "paused" : "running";
        dot.style.opacity = (tone === "success" || tone === "error") ? "1" : "";
      }
    }

    function getScheduleCardMetadata(candidate) {
      var anchor = candidate.matches && candidate.matches('a[href]') ? candidate :
        candidate.querySelector && candidate.querySelector('a[href*="ManageLecture"],a[href*="lectureId="],a[href*="TimeTableId="]');
      var card = candidate;
      if (candidate.matches && candidate.matches('a[href]')) {
        card = candidate.closest('div.cs-lesson-card,td,article,li,[role="gridcell"],[class*="lesson" i],[class*="schedule" i]') || candidate.parentElement;
      }
      if (!card) return null;

      var url = null;
      try { if (anchor && anchor.href) url = new URL(anchor.href, window.location.href); } catch (_) { }
      function attr(names) {
        for (var name of names) {
          var value = card.getAttribute && card.getAttribute(name);
          if (value) return String(value).trim();
        }
        return "";
      }
      function param(names) {
        if (!url) return "";
        for (var pair of url.searchParams.entries()) {
          if (names.some(function (name) { return name.toLowerCase() === pair[0].toLowerCase(); })) return pair[1];
        }
        return "";
      }

      var token = attr(['data-data','data-timetable-id','data-time-table-id','data-lecture-id']) ||
        param(['lectureId','TimeTableId','time_table_id','id']);
      var subjectId = attr(['data-subject-id','data-subjectid']) || param(['subjectId','subject_id']);
      var classId = attr(['data-class-id','data-classroom-id','data-classroomid']) || param(['classroomId','classId']);
      if (!token) return null;

      card.setAttribute('data-data', token);
      if (subjectId) card.setAttribute('data-subject-id', subjectId);
      if (classId && !card.getAttribute('data-class-id')) card.setAttribute('data-class-id', classId);
      var heading = card.querySelector && card.querySelector('h2,h3,h4,[data-subject-name],.subject-name,.course-name');
      var subjectName = heading ? (heading.textContent || '').trim() : attr(['data-subject-name']);
      return { card: card, token: token, subjectId: subjectId, subjectName: subjectName };
    }

    function findScheduleCards() {
      var selector = [
        'td.day-cell div[data-data]',
        'div.cs-lesson-card',
        '[data-timetable-id]',
        '[data-time-table-id]',
        '[data-lecture-id]',
        'a[href*="ManageLecture"]',
        'a[href*="lectureId="]',
        'a[href*="TimeTableId="]'
      ].join(',');
      var seen = new Set();
      var result = [];
      document.querySelectorAll(selector).forEach(function (candidate) {
        var metadata = getScheduleCardMetadata(candidate);
        if (!metadata || seen.has(metadata.card)) return;
        seen.add(metadata.card);
        result.push(metadata);
      });
      return result;
    }

    async function scanDashboardCards() {
      if (dashboardScanRunning || detectPageState() !== FLOW_STATES.DASHBOARD) return;
      dashboardScanRunning = true;
      try {
        injectDashboardPanel();
        var cards = findScheduleCards();
        dashboardLessonCount = cards.length;
        if (!cards.length) {
          updateDashboardStatus("تم تشغيل حضر، لكن لم يتم العثور على بطاقات الحصص بعد. سيتم الفحص تلقائياً.", "warning");
          updateDashboardCounter();
          return;
        }

        var added = 0;
        var missingSubject = 0;
        for (var item of cards) {
          if (item.card.querySelector('.Moeen-2-dashboard-select')) continue;
          if (!item.subjectId) {
            missingSubject++;
            continue;
          }
          var options = await fetchLessonTreeOptions(item.subjectId, item.subjectName);
          if (detectPageState() !== FLOW_STATES.DASHBOARD) return;
          if (!document.contains(item.card) || !options.length) continue;
          var select = createDashboardSelectDropdown(item.token, options);
          select.setAttribute('data-lesson-token', item.token);
          item.card.appendChild(select);
          added++;
        }
        updateDashboardCounter();
        var total = document.querySelectorAll('.Moeen-2-dashboard-select').length;
        if (total) {
          updateDashboardStatus("اختر درساً لكل حصة ثم اضغط «حفظ وبدء التحضير» — " + total + " حصة متاحة", "info");
        } else if (missingSubject === cards.length) {
          updateDashboardStatus("ظهرت لوحة حضر، لكن بنية بطاقات الجدول الجديدة لا تعرض معرّف المادة بعد.", "warning");
        } else if (!added) {
          updateDashboardStatus("تم العثور على الحصص، لكن تعذّر تحميل قائمة الدروس.", "warning");
        }
      } finally {
        dashboardScanRunning = false;
      }
    }

    async function injectDashboardUI() {
      dashboardInjected = true;
      injectDashboardPanel();
      updateDashboardSubscriptionBadge();
      void scanDashboardCards();
      if (!dashboardPollTimer) {
        dashboardPollTimer = setInterval(function () { void scanDashboardCards(); }, 1500);
      }
    }

    function startScheduleRouteWatcher() {
      if (scheduleRouteWatcher) return;
      function updateSurface() {
        if (!isTopLevelPage()) return;
        if (isLessonManagementPath()) {
          removeDashboardUI();
          removePresenceBadge();
          return;
        }
        if (detectPageState() === FLOW_STATES.DASHBOARD) {
          removePresenceBadge();
          void injectDashboardUI();
          return;
        }
        removeDashboardUI();
        injectPresenceBadge("active");
      }
      updateSurface();
      scheduleRouteWatcher = setInterval(updateSurface, 1000);
    }
    // ── Step 3: Silent (headless) lesson-plan saver ─────────────────────────────
    // Madrasati requires at least one Assignment/Activity/Enrichment resource bound
    // to the lesson tree before it will accept a SaveLastLessonPlan POST.
    //
    // Projects/Activities are protected by a per-form HashKey rendered server-side,
    // so we mimic the competitor's two-step flow: GET the Create page, scrape the
    // CSRF token + HashKey, then POST the activity payload using both.
    // ── Step 3: Silent (headless) lesson-plan saver ─────────────────────────────

    async function silentCreateActivityResource(subjectId, chapterId, lessonId, lessonName, realSchoolId, csrfToken) {
      const schoolId = String(realSchoolId).trim();

      // Use the lesson-context CSRF passed in by silentPrepareLesson; fetch the
      // Create page only to grab the per-page HashKey. The page may also expose
      // a fresher token — prefer it when present.
      let token = "";
      let hashKey = "";
      let doc = null;
      try {
        const getRes = await fetch(`/Projects/Projects/Create?schoolId=${schoolId}`, {
          credentials: "same-origin"
        });
        const html = await getRes.text();
        const parser = new DOMParser();
        doc = parser.parseFromString(html, "text/html");
        // CRITICAL: Madrasati's Create page contains MULTIPLE forms, each with its own
        // __RequestVerificationToken (logout form, header search, Create form, etc.).
        // querySelector('[name="__RequestVerificationToken"]') returns the FIRST one,
        // which is typically empty (belongs to a layout form), causing token="" and
        // the "Could not scrape CSRF token" error.
        //
        // Strategy: HashKey is UNIQUE to the Create form. Find it first, walk up to
        // its enclosing <form>, and extract the token from THAT form.
        hashKey = doc.querySelector('[name="HashKey"]')?.value || "";

        const hashKeyEl = doc.querySelector('[name="HashKey"]');
        const createForm = hashKeyEl?.closest('form');
        if (createForm) {
          token = createForm.querySelector('[name="__RequestVerificationToken"]')?.value || "";
        }

        // Fallback: if scoping failed, scan ALL __RequestVerificationToken inputs and
        // pick the first NON-EMPTY one (usually the Create form's token).
        if (!token) {
          const allTokens = doc.querySelectorAll('[name="__RequestVerificationToken"]');
          for (const el of allTokens) {
            if (el.value && el.value.length > 20) {
              token = el.value;
              console.log('[Moeen-2] CSRF token resolved via fallback scan (token #' +
                Array.from(allTokens).indexOf(el) + ' of ' + allTokens.length + ')');
              break;
            }
          }
        }

        console.log('[Moeen-2] Create page scrape →',
          'tokens found:', doc.querySelectorAll('[name="__RequestVerificationToken"]').length,
          '| token resolved:', token ? token.slice(0, 30) + '...' : 'EMPTY',
          '| hashKey:', hashKey ? hashKey.slice(0, 30) + '...' : 'EMPTY',
          '| createForm found:', !!createForm);
      } catch (e) {
        console.error("[Moeen-2] Failed to fetch Create page for tokens", e);
        return false;
      }

      if (!token) {
        console.error("[Moeen-2] Could not scrape CSRF token from /Projects/Projects/Create page. Aborting Activity creation.");
        return false;
      }

      if (!hashKey) return false;

      // hfDrawTree from page, but hfLevelsCount MUST match the number of tree levels we send (always 3)
      const hfDrawTree = doc.querySelector('[name="hfDrawTree"]')?.value || "/Projects/Projects/DrawTreeToClassLesson";
      const hfLevelsCount = "3"; // Always 3: we always send SelectedUnitId + SelectedTrees_2 + SelectedTrees_3

      console.log("[Moeen-2] Activity POST params — HashKey:", hashKey, "hfLevelsCount:", hfLevelsCount, "token:", token.slice(0, 20) + "...");

      const payload = new URLSearchParams();
      payload.append("TypeId", "1");
      payload.append("__RequestVerificationToken", token);
      payload.append("HashKey", hashKey);
      // Verified from competitor's working trace: Id is sent as EMPTY STRING.
      // ARCHITECTURE.md §4.3 incorrectly says "0" — that value is silently rejected.
      payload.append("Id", "");
      payload.append("schoolId", schoolId);
      payload.append("SelectedUnitId", subjectId);
      payload.append("SelectedTrees_2", chapterId);
      payload.append("SelectedTrees_3", lessonId);
      payload.append("Name", `نشاط (${lessonName})`);
      payload.append("CategoryId", "4");
      payload.append("ClassificationLevel", "1");
      // Verified from competitor's working trace: ProjectType is sent TWICE —
      // first as "2", then as empty string. Single occurrence may be silently rejected.
      payload.append("ProjectType", "2");
      payload.append("ProjectType", "");
      payload.append("Description", "نشاط تدريبي داعم لموضوع الدرس");
      payload.append("Link", "https://ien.edu.sa");
      payload.append("SolvingType", "3");
      payload.append("AccessType", "True");
      payload.append("hfLevelsCount", hfLevelsCount);
      payload.append("hfDrawTree", hfDrawTree);
      payload.append("TotalGrade", "1");

      console.log("[Moeen-2] Activity POST full payload:", payload.toString());
      try {
        // Use redirect:'manual' so we can read the Location header.
        // The server typically 302-redirects to /Projects/Projects/Edit/{newId} or similar.
        const saveRes = await fetch("/Projects/Projects/Create", {
          method: "POST",
          credentials: "same-origin",
          redirect: "manual",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "requestverificationtoken": token
          },
          body: payload.toString()
        });
        console.log("[Moeen-2] Activity POST response — status:", saveRes.status, "type:", saveRes.type, "url:", saveRes.url);
        // Status 0 + type 'opaqueredirect' means the redirect happened — treat as success.
        if (saveRes.type === 'opaqueredirect' || saveRes.status === 0) {
          console.log("[Moeen-2] Activity POST → opaque redirect (treated as success)");
          return true;
        }
        if (!saveRes.ok) return false;
        return true;
      } catch (e) {
        console.error("[Moeen-2] Failed to POST silent Activity", e);
        return false;
      }
    }

    // ── Session 2: Enrichment (إثراء) silent API creation ──────────────────────
    // Mirrors silentCreateActivityResource but targets LearningResources/MangeResources/Create.
    // Key differences from Activity:  Id="0" (not ""),  hfLevelsCount="1" (not "3"),
    // requires SelectedGoles (base64 JSON of goal IDs) and IndicativeWords (UTF-8 base64).
    // Enrichment does NOT add fields to SaveLastLessonPlan — it's a standalone resource.
    async function silentCreateEnrichmentResource(subjectId, chapterId, lessonId, lessonName, realSchoolId) {
      const schoolId = String(realSchoolId).trim();

      // ── Inner helpers: MangeResources/Index DIFF to resolve newly-created enrichment's activity ID ──
      // Root-cause note: GetActivitiesList only shows IEN/curated enrichments from the lesson bank —
      // teacher-created enrichments NEVER appear there (returns "لايوجد إثراءات" even after creation).
      // The correct source is the MangeResources/Index page which lists ALL teacher-authored enrichments
      // with hex-GUID activityIds in the form activityId=<32-hex-chars> in edit/view URLs.
      const _indexSnapshot = async function (label) {
        const snapIds = new Set();
        try {
          const res = await fetch('/LearningResources/MangeResources/Index/' + encodeURIComponent(schoolId), {
            method: 'GET',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: { 'Accept': 'text/html,*/*' }
          });
          if (res.ok) {
            const html = await res.text();
            const pats = [
              /activityId=([0-9A-Fa-f]{32})/gi,
              /ViewResource\/Index\/([0-9A-Fa-f]{32})/gi
            ];
            for (const re of pats) {
              let m; re.lastIndex = 0;
              while ((m = re.exec(html)) !== null) snapIds.add(m[1].toUpperCase());
            }
          }
        } catch (e) {
          console.warn('[Moeen-2] Enrichment _indexSnapshot [' + label + '] threw:', e && e.message);
        }
        console.log('[Moeen-2] Enrichment _indexSnapshot [' + label + ']:', snapIds.size, 'id(s)');
        return snapIds;
      };

      const _pollForNewActivityId = async function (beforeSnap) {
        const schedule = [1000, 2000, 3000, 3000, 3000];
        let lastSnap = beforeSnap;
        let waitedMs = 0;
        for (let i = 0; i < schedule.length; i++) {
          await new Promise(function (r) { setTimeout(r, schedule[i]); });
          waitedMs += schedule[i];
          lastSnap = await _indexSnapshot('after-probe-' + (i + 1));
          const newIds = [...lastSnap].filter(function (id) { return !beforeSnap.has(id); });
          if (newIds.length > 0) {
            // Return first new ID (Index page lists most-recently-created first)
            const picked = newIds[0];
            console.log('[Moeen-2] ✅ Enrichment DIFF → new activity ID:', picked, '(after', waitedMs, 'ms, probe', i + 1, ')');
            return picked;
          }
          console.warn('[Moeen-2] Enrichment DIFF probe', i + 1, '— no new activity ID yet (before=' + beforeSnap.size + ', after=' + lastSnap.size + ')');
        }
        // Fallback: if before was empty and now has items, take the first (oldest visible = newest created)
        if (beforeSnap.size === 0 && lastSnap.size > 0) {
          const picked = [...lastSnap][0];
          console.warn('[Moeen-2] Enrichment DIFF timed out — before was empty, using first item from final snapshot:', picked);
          return picked;
        }
        console.warn('[Moeen-2] Enrichment DIFF exhausted — activity ID not found (enrichment was created but linking to lecture will be skipped)');
        return '';
      };

      // 1. Scrape CSRF + HashKey from the MangeResources/Create page
      //    Use the same query params as the native UI (isNotUserLayout=True hides the main nav/layout
      //    and selectedSubjectId scopes the form to the correct subject).
      //    Using ?schoolId=... caused the server to redirect to the landing page (status 200 homepage),
      //    which has no CSRF token — causing enrichment creation to abort silently.
      let token = '';
      let hashKey = '';
      let hfDrawTree = '/LearningResources/MangeResources/DrawTreeToClassLesson';
      const _createQs = '?isNotUserLayout=True&selectedSubjectId=' + encodeURIComponent(String(subjectId)) + '&isMainPage=False';
      try {
        // CSRF source: Projects/Projects/Create (works regardless of MangeResources permissions).
        // Verified from competitor HAR: the same anti-forgery token is reused for both Activity
        // and Enrichment POSTs in the same session.
        const getRes = await fetch('/Projects/Projects/Create?schoolId=' + encodeURIComponent(schoolId), {
          credentials: 'same-origin',
          redirect: 'follow'
        });
        // Guard: if server redirected away from Projects/Create, the session is invalid.
        if (getRes.url && !getRes.url.includes('Projects/Projects/Create')) {
          console.error('[Moeen-2] Enrichment: Projects/Create GET redirected to unexpected URL:', getRes.url, '— session may have expired');
          return '';
        }
        const html = await getRes.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const hashKeyEl = doc.querySelector('[name="HashKey"]');
        hashKey = hashKeyEl?.value || '';
        const createForm = hashKeyEl?.closest('form');
        if (createForm) {
          token = createForm.querySelector('[name="__RequestVerificationToken"]')?.value || '';
        }
        if (!token) {
          const allTokens = doc.querySelectorAll('[name="__RequestVerificationToken"]');
          for (const el of allTokens) {
            if (el.value && el.value.length > 20) { token = el.value; break; }
          }
        }
        hfDrawTree = doc.querySelector('[name="hfDrawTree"]')?.value || hfDrawTree;
        console.log('[Moeen-2] Enrichment Create page scraped → token:', token ? token.slice(0, 20) + '...' : 'EMPTY', '| hashKey:', hashKey ? hashKey.slice(0, 20) + '...' : 'EMPTY');
      } catch (e) {
        console.error('[Moeen-2] Enrichment: failed to fetch Create page', e);
        return '';
      }

      if (!token) {
        console.error('[Moeen-2] Enrichment: no CSRF token found — aborting');
        return '';
      }

      // 2. Fetch goals for SelectedGoles (base64 JSON of [{GoalId, LessonId},...])
      //    GetGoalLessonSubject returns an array where each row is a goal-lesson mapping.
      //    We filter for our specific lessonId and encode with btoa(JSON.stringify(...)).
      let selectedGolesB64 = btoa('[]'); // fallback: empty array
      try {
        const goalsRes = await fetch('/LearningResources/MangeResources/GetGoalLessonSubject', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'requestverificationtoken': token
          },
          body: 'subjectId=' + encodeURIComponent(String(subjectId))
        });
        const goalsData = await goalsRes.json();
        if (Array.isArray(goalsData)) {
          const lessonIdNum = parseInt(lessonId, 10);
          // NOTE: native UI sends GoalId and LessonId as STRINGS (confirmed from captured payload)
          const goalEntries = goalsData
            .filter(function (row) { return row && row.GoalId && Number(row.LessonId) === lessonIdNum; })
            .map(function (row) { return { GoalId: String(row.GoalId), LessonId: String(lessonIdNum) }; });
          if (goalEntries.length > 0) {
            selectedGolesB64 = btoa(JSON.stringify(goalEntries));
            console.log('[Moeen-2] Enrichment: SelectedGoles built with', goalEntries.length, 'goal(s) for lessonId', lessonId);
          } else {
            // Fallback: use all goals from the subject (different subjects may use different
            // lesson ID formats; an empty SelectedGoles causes the server to return 200/form-HTML
            // instead of 302, so we must always send at least one entry).
            const allGoalEntries = goalsData
              .filter(function (row) { return row && row.GoalId; })
              .slice(0, 10)
              .map(function (row) { return { GoalId: String(row.GoalId), LessonId: String(Number(row.LessonId) || lessonIdNum) }; });
            if (allGoalEntries.length > 0) {
              selectedGolesB64 = btoa(JSON.stringify(allGoalEntries));
              console.warn('[Moeen-2] Enrichment: lessonId', lessonId, 'not found in goals — using first', allGoalEntries.length, 'subject goal(s) as fallback');
            } else {
              console.warn('[Moeen-2] Enrichment: GetGoalLessonSubject returned no goals at all for subjectId', subjectId, '— enrichment Create will likely return 200 (failure)');
            }
          }
        }
      } catch (e) {
        console.warn('[Moeen-2] Enrichment: failed to fetch goals, using empty array', e);
      }

      // 4. Build and POST the Enrichment payload
      // Field order and values match the native UI form submission exactly (confirmed from captured payload).
      const payload = new URLSearchParams();
      payload.append('SelectedUnitId', String(subjectId));
      payload.append('IsEduResource', 'true');         // checkbox=true (sent first)
      payload.append('IsMainPage', 'False');        // body field (also in URL query)
      payload.append('Id', '0');            // enrichment uses "0", NOT "" like Activity
      payload.append('ActivityType', '1');
      payload.append('Name', 'إثراء: ' + lessonName);
      payload.append('Description', 'إثراء: ' + lessonName);
      payload.append('IndicativeWords', '');             // native sends empty
      payload.append('FileType', '1');
      payload.append('FilePath', '');
      payload.append('FileHelpText', '');
      payload.append('Link', 'https://ien.edu.sa');
      payload.append('hfLevelsCount', '1');            // enrichment uses "1", NOT "3"
      payload.append('hfDrawTree', hfDrawTree);
      payload.append('getGoalLessonSubjectUrl', '/LearningResources/MangeResources/GetGoalLessonSubject');
      payload.append('SchoolId', schoolId);
      payload.append('oneDriveTypesValidations', 'pdf,png,jpeg,jpg');
      payload.append('DriveFileName', '');
      payload.append('SelectedGoles', selectedGolesB64);
      payload.append('__RequestVerificationToken', token);
      payload.append('IsEduResource', 'false');        // hidden field (ASP.NET checkbox pattern)

      // ── Snapshot MangeResources/Index BEFORE creation (DIFF strategy to get new activity ID) ──
      const _actBeforeIds = await _indexSnapshot('before-create');

      console.log('[Moeen-2] Enrichment POST payload → Name:', 'إثراء: ' + lessonName, '| hfLevelsCount:1 | golesLen:', selectedGolesB64.length);
      try {
        const saveRes = await fetch('/LearningResources/MangeResources/Create' + _createQs, {
          method: 'POST',
          credentials: 'same-origin',
          redirect: 'manual',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: payload.toString()
        });
        // 302 / opaqueredirect = success (same pattern as Activity).
        // DO NOT return saveRes.ok for a 200: a 200 means the server re-rendered the
        // "إضافة إثراء" form (validation failure — e.g. empty SelectedGoles or
        // a missing required field). Treating it as success would mask the failure.
        if (saveRes.type === 'opaqueredirect' || saveRes.status === 0) {
          console.log('[Moeen-2] ✅ Enrichment created successfully (302 redirect) — resolving activity ID via DIFF...');
          return await _pollForNewActivityId(_actBeforeIds);
        }
        let _bodyLen = 0;
        try { const _t = await saveRes.text(); _bodyLen = _t.length; } catch (_) { }
        console.warn('[Moeen-2] Enrichment: Create returned status', saveRes.status, '(expected 302). Likely form re-render (validation failed). Body length:', _bodyLen);
        return '';
      } catch (e) {
        console.error('[Moeen-2] Enrichment: POST failed', e);
        return '';
      }
    }

    function parseMadrasatiResourceDateValue(value) {
      const s = String(value || '').trim();
      if (!s) return null;
      let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\s*(AM|PM))?$/i);
      if (m) {
        let hour = Number(m[4]);
        const ampm = (m[7] || '').toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]), hour, Number(m[5]), Number(m[6]));
        return isNaN(d.getTime()) ? null : d;
      }
      m = s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
      if (m) {
        const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 8, 0, 0);
        return isNaN(d.getTime()) ? null : d;
      }
      const parsed = new Date(s);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatMadrasatiResourceDateValue(d) {
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const year = d.getFullYear();
      let hour = d.getHours();
      const min = String(d.getMinutes()).padStart(2, '0');
      const sec = String(d.getSeconds()).padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return month + '/' + day + '/' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + ampm;
    }

    function formatGregorianYmd(d) {
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '/' + month + '/' + day;
    }

    function addDays(date, days) {
      return new Date(date.getTime() + Number(days || 0) * 24 * 60 * 60 * 1000);
    }

    function injectHomeworkIntoPageState(assignmentId, attachData, options) {
      const payload = {
        assignmentId: String(assignmentId || ''),
        grade: String((options && options.grade) || '1'),
        assignmentName: String((options && options.assignmentName) || 'واجب'),
        assignmentType: String((attachData && attachData.assignmentType) || (options && options.assignmentType) || '1'),
        dayCount: String((options && options.dayCount) || '3'),
        timeTableId: String((options && options.timeTableId) || ''),
        startDateTime: String((attachData && attachData.startDateTime) || (options && options.startDateTime) || ''),
        endDateTime: String((attachData && attachData.endDateTime) || (options && options.endDateTime) || ''),
        startDateTimeHijri: String((attachData && attachData.startDateTimeHijri) || ''),
        endDateTimeHijri: String((attachData && attachData.endDateTimeHijri) || ''),
        isGradeBook: attachData && attachData.isGradeBook != null ? attachData.isGradeBook : true,
        assignmentIdEnc: String((attachData && attachData.assignmentIdEnc) || '')
      };
      if (!payload.assignmentId) return false;
      try {
        const script = document.createElement('script');
        script.textContent =
          '(function(payload){try{' +
          'var list=null;' +
          'if(typeof listOfAssignments!=="undefined"&&Array.isArray(listOfAssignments)){list=listOfAssignments;}' +
          'else if(Array.isArray(window.listOfAssignments)){list=window.listOfAssignments;}' +
          'if(list){' +
          'var exists=list.some(function(x){return String(x&&x.assignmentId)===String(payload.assignmentId);});' +
          'if(!exists){list.push({' +
          'assignmentId:payload.assignmentId,grade:payload.grade,assignmentName:payload.assignmentName,' +
          'startDateTime:payload.startDateTime,endDateTime:payload.endDateTime,' +
          'startDateTimeHijri:payload.startDateTimeHijri,endDateTimeHijri:payload.endDateTimeHijri,' +
          'isGradeBook:payload.isGradeBook,assignmentIdEnc:payload.assignmentIdEnc,' +
          'assignmentType:payload.assignmentType,DayCount:payload.dayCount,TimeTableIds:payload.timeTableId?[{timeTableId:payload.timeTableId,slot:"",date:"",classroom:""}]:[]' +
          '});}' +
          '}' +
          'if(typeof loadAssignmentsList==="function"){try{loadAssignmentsList();}catch(_){}}' +
          'console.log("[Moeen-2] Page listOfAssignments injected -> AssignmentId:",payload.assignmentId,"list:",list&&list.length);' +
          '}catch(e){console.warn("[Moeen-2] Page listOfAssignments injection failed:",e&&e.message);}})(' +
          JSON.stringify(payload).replace(/</g, '\\u003c') +
          ');';
        (document.documentElement || document.head || document.body).appendChild(script);
        script.remove();
        return true;
      } catch (e) {
        console.warn('[Moeen-2] Could not inject homework into page state:', e && e.message);
        return false;
      }
    }

    async function silentAttachHomeworkToLecture(options) {
      const settings = options || {};
      const assignmentId = String(settings.assignmentId || '').trim();
      if (!assignmentId) return { ok: false, data: null, status: 0, message: 'missing assignmentId' };

      const startRaw = String(settings.startDateRaw || getFieldValue('#StartDate') || '').trim();
      const startDate = parseMadrasatiResourceDateValue(startRaw) || new Date();
      const dayCount = String(settings.dayCount || '3');
      const endDate = parseMadrasatiResourceDateValue(settings.endDateRaw) || addDays(startDate, Number(dayCount) || 3);
      const isMulti = settings.isMulti === true || String(settings.isMulti || '').toLowerCase() === 'true';
      const schoolId = String(settings.schoolId || getNumericSchoolIdValue() || '').trim();
      const subjectId = String(settings.subjectId || getFieldValue('#SelectedUnitId') || '').trim();
      const timeTableId = String(settings.timeTableId || getFieldValue('#TimeTableId') || '').trim();

      const body = new URLSearchParams();
      body.set('assignmentId', assignmentId);
      body.set('StartDate', startRaw || formatMadrasatiResourceDateValue(startDate));
      body.set('SchoolId', schoolId);
      body.set('sDate', isMulti ? '' : formatGregorianYmd(startDate));
      body.set('eDate', isMulti ? '' : formatGregorianYmd(endDate));
      body.set('isGradeBook', settings.isGradeBook === false ? 'false' : 'true');
      body.set('assignmentType', String(settings.assignmentType || '1'));
      body.set('DayCount', dayCount);
      body.set('selectedUnitId', subjectId);
      body.set('TimeTableId', timeTableId);

      try {
        console.log('[Moeen-2] AddAssignmentToLecture POST → AssignmentId:', assignmentId, 'SchoolId:', schoolId, 'TimeTableId:', timeTableId, 'isMulti:', isMulti);
        const res = await fetch('/Teacher/LectureTools/AddAssignmentToLecture', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body.toString()
        });
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (_) { }
        if (!res.ok) {
          console.warn('[Moeen-2] AddAssignmentToLecture failed status', res.status, 'body:', text.slice(0, 240));
          return { ok: false, data: data, status: res.status, message: text.slice(0, 240) };
        }
        console.log('[Moeen-2] AddAssignmentToLecture accepted → AssignmentId:', assignmentId, 'response:', data || text.slice(0, 160));
        return { ok: true, data: data || {}, status: res.status, message: '' };
      } catch (e) {
        console.warn('[Moeen-2] AddAssignmentToLecture threw:', e && e.message);
        return { ok: false, data: null, status: 0, message: e && e.message };
      }
    }

    // ── Enrichment (إثراء) lecture linking: POST AddActivityToLecture ──────────────
    // Called after silentCreateEnrichmentResource resolves the enrichment's activity ID.
    // Returns { ok, data, status, message } — same shape as silentAttachHomeworkToLecture.
    async function silentAttachEnrichmentToLecture(options) {
      const settings = options || {};
      const activityId = String(settings.activityId || '').trim();
      if (!activityId) return { ok: false, data: null, status: 0, message: 'missing activityId' };

      const schoolId = String(settings.schoolId || '').trim();
      const subjectId = String(settings.subjectId || '').trim();
      const timeTableId = String(settings.timeTableId || '').trim();
      const startDate = parseMadrasatiResourceDateValue(settings.startDateRaw) || new Date();
      const endDate = addDays(startDate, 3);

      const body = new URLSearchParams();
      body.set('activityId', activityId);
      body.set('SchoolId', schoolId);
      body.set('selectedUnitId', subjectId);
      body.set('TimeTableId', timeTableId);
      body.set('sDate', formatGregorianYmd(startDate));
      body.set('eDate', formatGregorianYmd(endDate));
      body.set('DayCount', '3');

      try {
        console.log('[Moeen-2] AddActivityToLecture POST → activityId:', activityId, 'SchoolId:', schoolId, 'TimeTableId:', timeTableId);
        const res = await fetch('/Teacher/LectureTools/AddActivityToLecture', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: body.toString()
        });
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (_) { }
        if (!res.ok) {
          console.warn('[Moeen-2] AddActivityToLecture failed status', res.status, 'body:', text.slice(0, 240));
          return { ok: false, data: data, status: res.status, message: text.slice(0, 240) };
        }
        console.log('[Moeen-2] ✅ AddActivityToLecture accepted → activityId:', activityId, 'response:', data || text.slice(0, 160));
        return { ok: true, data: data || {}, status: res.status, message: '' };
      } catch (e) {
        console.warn('[Moeen-2] AddActivityToLecture threw:', e && e.message);
        return { ok: false, data: null, status: 0, message: e && e.message };
      }
    }

    // ── Session 3: Homework / Assignment (واجب) silent API creation ────────────────
    // Flow: before-snapshot → AddQuestionListPaging (get IEN question IDs) → Manage POST
    //       → poll GetAssignmentsList until DIFF exposes the new AssignmentId.
    // Returns '' on any failure (fail-soft — never aborts the lesson save).
    async function silentCreateHomeworkResource(subjectId, chapterId, lessonId, lessonName, realSchoolId) {
      const schoolId = String(realSchoolId).trim();
      const subjectIdStr = String(subjectId).trim();
      const lessonIdStr = String(lessonId).trim();
      const chapterIdStr = String(chapterId).trim();

      // ── Inner helper: call GetAssignmentsList → Set of Assignment IDs ──────
      async function _hwSnapshot(label) {
        const body = new URLSearchParams();
        body.append('title', '');
        body.append('lectureAssignmentsList', '');
        body.append('sumLectureAssignmentsGradeBook', '0');
        body.append('selectedUnitId', subjectIdStr);
        body.append('treeId', lessonIdStr);
        body.append('lessonsId[]', lessonIdStr);
        body.append('childOfSubject', chapterIdStr);
        body.append('schoolId', schoolId);
        body.append('accessType', '');
        body.append('createdByme', 'false');
        const snapIds = new Set();
        try {
          const res = await fetch('/Teacher/LectureTools/GetAssignmentsList', {
            method: 'POST',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Accept': '*/*',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: body.toString()
          });
          let htmlInner = await res.text();
          try { const j = JSON.parse(htmlInner); if (j && typeof j.html === 'string') htmlInner = j.html; } catch (e) { }
          // Captured shapes:
          //   <a class="selectAssignment ..." id="225114942">
          //   <input value="225114942" name="assignmentId_225114942" id="assignmentId_225114942">
          //   checkAssignment(this,225114942)
          const pats = [
            /class=["'][^"']*selectAssignment[^"']*["'][^>]*id=["'](\d{6,12})["']/gi,
            /id=["'](\d{6,12})["'][^>]*class=["'][^"']*selectAssignment/gi,
            /name=["']assignmentId_(\d{6,12})["']/gi,
            /id=["']assignmentId_(\d{6,12})["']/gi,
            /value=["'](\d{6,12})["'][^>]*(?:name|id)=["']assignmentId_\d{6,12}["']/gi,
            /(?:name|id)=["']assignmentId_\d{6,12}["'][^>]*value=["'](\d{6,12})["']/gi,
            /hfGradeBookTotalValue_(\d{6,12})/gi,
            /assignmentId=(\d{6,12})/gi,
            /checkAssignment\(\s*this\s*,\s*(\d{6,12})\s*\)/gi
          ];
          for (const pat of pats) {
            let m; pat.lastIndex = 0;
            while ((m = pat.exec(htmlInner)) !== null) snapIds.add(String(m[1]));
          }
        } catch (e) {
          console.warn('[Moeen-2] Homework snapshot (' + label + ') threw:', e && e.message);
        }
        console.log('[Moeen-2] Homework ' + label + ' snapshot:', snapIds.size, 'assignment(s)');
        return snapIds;
      }

      function _pickNewestAssignmentId(ids) {
        const arr = [...ids].filter(Boolean);
        if (arr.length === 0) return '';
        return String(arr.map(s => BigInt(s)).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))[0]);
      }

      async function _waitForNewHomeworkId(beforeSnap) {
        // GetAssignmentsList can lag far behind Assignments/Manage. The manual
        // capture showed ~30s, so poll longer than the activity path.
        const waitSchedule = [1000, 2000, 4000, 4000, 5000, 5000, 5000, 5000, 5000];
        let waitedMs = 0;
        let latestSnap = new Set();
        for (let i = 0; i < waitSchedule.length; i++) {
          await new Promise(function (r) { setTimeout(r, waitSchedule[i]); });
          waitedMs += waitSchedule[i];
          const afterSnap = await _hwSnapshot('after-probe-' + (i + 1));
          latestSnap = afterSnap;
          const newIds = [...afterSnap].filter(function (id) { return !beforeSnap.has(id); });
          if (newIds.length === 1) {
            console.log('[Moeen-2] ✅ Homework DIFF SUCCESS — AssignmentId:', newIds[0], 'after', waitedMs, 'ms');
            return String(newIds[0]);
          }
          if (newIds.length > 1) {
            const picked = _pickNewestAssignmentId(newIds);
            console.warn('[Moeen-2] Homework DIFF found', newIds.length, 'new assignment IDs; picked newest:', picked, 'all:', newIds);
            return picked;
          }
          console.warn('[Moeen-2] ⏳ Homework DIFF probe', i + 1, 'found no new assignment yet (before=' + beforeSnap.size + ', after=' + afterSnap.size + ').');
        }
        if (beforeSnap.size === 0 && latestSnap.size > 0) {
          const picked = _pickNewestAssignmentId(latestSnap);
          console.warn('[Moeen-2] Homework DIFF timed out, but scoped list now has assignment(s); using newest:', picked);
          return picked;
        }
        return '';
      }

      // 1. Before snapshot (baseline of current assignments)
      const beforeSnap = await _hwSnapshot('before');

      // Reuse existing: if an assignment already exists for this lesson, skip creation
      // (server rejects duplicates for the same lesson, causing DIFF to return empty)
      if (beforeSnap.size > 0) {
        const existingId = _pickNewestAssignmentId(beforeSnap);
        console.log('[Moeen-2] Homework: existing assignment found → reusing ID', existingId, '(skipping creation)');
        return existingId;
      }

      // 2. Prime the live homework UI context, then get CSRF token.
      // Current Madrasati UI calls LectureTools/AddAssignment before opening
      // Assignments/Manage. It may return a context-specific Manage URL.
      let csrfToken = document.querySelector('#csrfid')?.value
        || document.querySelector('input[name="__RequestVerificationToken"]')?.value
        || '';
      let homeworkManageGetUrl = '';
      let homeworkManagePostUrl = '/Teacher/Assignments/Manage?isNotUserLayout=True&selectedSubjectId=' + encodeURIComponent(subjectIdStr);
      let homeworkManageDefaults = new URLSearchParams();
      const homeworkManageContextQuery =
        'isNotUserLayout=True' +
        '&selectedSubjectId=' + encodeURIComponent(subjectIdStr) +
        '&selectedTreeId=' + encodeURIComponent(chapterIdStr) +
        '&selectedLessonse=' + encodeURIComponent(lessonIdStr);

      function _normalizeManageUrl(url, baseUrl) {
        try {
          const u = new URL(url, baseUrl || window.location.href);
          if (u.origin === window.location.origin) return u.pathname + u.search;
          return u.href;
        } catch (e) {
          return String(url || '');
        }
      }

      function _rememberManageDefaults(doc, baseUrl) {
        const form = doc.querySelector('form[action*="/Teacher/Assignments/Manage"]') || doc.querySelector('form');
        const root = form || doc;
        root.querySelectorAll('input[name], select[name], textarea[name]').forEach(function (el) {
          const name = el.getAttribute('name');
          if (!name) return;
          const tag = (el.tagName || '').toLowerCase();
          const type = (el.getAttribute('type') || '').toLowerCase();
          if ((type === 'checkbox' || type === 'radio') && !el.checked) return;
          if (tag === 'select') {
            const selectedOptions = Array.prototype.slice.call(el.options || []).filter(function (opt) { return opt.selected; });
            if (selectedOptions.length === 0) {
              homeworkManageDefaults.append(name, el.value || '');
            } else {
              selectedOptions.forEach(function (opt) { homeworkManageDefaults.append(name, opt.value || ''); });
            }
            return;
          }
          const value = tag === 'textarea'
            ? (el.value || el.textContent || '')
            : (el.getAttribute('value') != null ? el.getAttribute('value') : (el.value || ''));
          homeworkManageDefaults.append(name, value);
        });
        const action = (form && form.getAttribute('action')) || '';
        if (action) {
          homeworkManagePostUrl = _normalizeManageUrl(action.replace(/&amp;/g, '&'), baseUrl);
          console.log('[Moeen-2] Homework: Manage POST action scraped:', homeworkManagePostUrl);
        }
      }

      try {
        const addBody = new URLSearchParams();
        addBody.append('selectedUnitId', subjectIdStr);
        addBody.append('treeId', lessonIdStr);
        addBody.append('lessonsId[]', lessonIdStr);
        addBody.append('childOfSubject', chapterIdStr);
        addBody.append('schoolId', schoolId);
        addBody.append('isNotUserLayout', 'True');
        addBody.append('selectedSubjectId', subjectIdStr);
        addBody.append('selectedTreeId', chapterIdStr);
        addBody.append('selectedLessonse', lessonIdStr);
        const addRes = await fetch('/Teacher/LectureTools/AddAssignment', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: addBody.toString()
        });
        const addRaw = await addRes.text();
        let addHtml = addRaw;
        try {
          const j = JSON.parse(addRaw);
          const jsonParts = [addRaw];
          ['html', 'url', 'Url', 'redirectUrl', 'RedirectUrl', 'location', 'Location'].forEach(function (key) {
            if (j && typeof j[key] === 'string') jsonParts.push(j[key]);
          });
          addHtml = jsonParts.join('\n');
        } catch (e) { }
        const manageMatch = addHtml.match(/(?:href|action)=["']([^"']*\/Teacher\/Assignments\/Manage\?[^"']+)["']/i)
          || addHtml.match(/["'](\/Teacher\/Assignments\/Manage\?[^"']+)["']/i);
        if (manageMatch && manageMatch[1]) {
          homeworkManageGetUrl = manageMatch[1].replace(/&amp;/g, '&');
          console.log('[Moeen-2] Homework: AddAssignment returned Manage URL:', homeworkManageGetUrl.slice(0, 180));
        } else {
          const assignmentMatch = addHtml.match(/[?&]assignmentId=([^&"'<>]+)/i)
            || addHtml.match(/["']assignmentId["']\s*:\s*["']([^"']+)["']/i);
          if (assignmentMatch && assignmentMatch[1]) {
            homeworkManageGetUrl =
              '/Teacher/Assignments/Manage?assignmentId=' + assignmentMatch[1].replace(/&amp;/g, '&') +
              '&schoolId=' + encodeURIComponent(schoolId) +
              '&' + homeworkManageContextQuery;
            console.log('[Moeen-2] Homework: AddAssignment returned assignmentId; built Manage URL:', homeworkManageGetUrl.slice(0, 180));
          }
          console.log('[Moeen-2] Homework: AddAssignment status', addRes.status, '(no Manage URL found)');
        }
      } catch (e) {
        console.warn('[Moeen-2] Homework: AddAssignment preflight failed, continuing with direct Manage route:', e && e.message);
      }

      const manageGetCandidates = [];
      if (homeworkManageGetUrl) manageGetCandidates.push(homeworkManageGetUrl);
      manageGetCandidates.push('/Teacher/Assignments/Manage?' + homeworkManageContextQuery + '&schoolId=' + encodeURIComponent(schoolId));
      manageGetCandidates.push('/Teacher/Assignments/Manage?isNotUserLayout=True&selectedSubjectId=' + encodeURIComponent(subjectIdStr));
      const seenManageUrls = new Set();
      for (const getUrl of manageGetCandidates) {
        if (!getUrl || seenManageUrls.has(getUrl)) continue;
        seenManageUrls.add(getUrl);
        try {
          const getRes = await fetch(getUrl, { credentials: 'same-origin' });
          const html = await getRes.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const defaultsBefore = homeworkManageDefaults.toString();
          _rememberManageDefaults(doc, getUrl);
          const pageToken = doc.querySelector('input[name="__RequestVerificationToken"]')?.value
            || doc.querySelector('meta[name="RequestVerificationToken"]')?.content
            || '';
          if (pageToken) csrfToken = pageToken;
          if (pageToken || homeworkManageDefaults.toString() !== defaultsBefore) {
            console.log('[Moeen-2] Homework: Manage page scraped from:', getUrl.slice(0, 180));
            break;
          }
        } catch (e) {
          console.warn('[Moeen-2] Homework: failed to scrape Manage page', getUrl, e && e.message);
        }
      }
      if (!csrfToken) {
        console.error('[Moeen-2] Homework: no CSRF token — aborting');
        return '';
      }
      let manageResponseAssignmentId = '';

      // 3. AddQuestionListPaging → fetch first IEN question ID available for this lesson
      //    Payload mirrors the competitor HAR exactly (note: "eschoolId" not "schoolId"!)
      let questionIds = [];
      try {
        const qBody = new URLSearchParams();
        qBody.append('subjectId', subjectIdStr);
        qBody.append('eschoolId', schoolId);   // NOTE: eschoolId, NOT schoolId!
        qBody.append('treeId', lessonIdStr);
        qBody.append('lessonId', lessonIdStr);
        qBody.append('isTreelevel', 'false');
        qBody.append('pageNumber', '1');
        qBody.append('searchInput', '');
        qBody.append('questionType', '');
        qBody.append('difficultyLevel', '');
        qBody.append('creator', '0');
        const qRes = await fetch('/Teacher/Assignments/AddQuestionListPaging', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'requestverificationtoken': csrfToken
          },
          body: qBody.toString()
        });
        let qHtml = await qRes.text();
        try { const j = JSON.parse(qHtml); if (j && typeof j.html === 'string') qHtml = j.html; } catch (e) { }
        // Try multiple ID extraction patterns for the Q-bank HTML
        const qPatterns = [
          /data-questionid=["'](\d{4,12})["']/gi,
          /data-qid=["'](\d{4,12})["']/gi,
          /id=["']q_(\d{4,12})["']/gi,
          /<input[^>]+type=["']checkbox["'][^>]+value=["'](\d{4,12})["']/gi,
          /name=["']questionId["'][^>]*value=["'](\d{4,12})["']/gi,
          /value=["'](\d{4,12})["'][^>]*name=["']questionId["']/gi,
          /class=["'][^"']*addQuestion[^"']*["'][^>]*data-id=["'](\d{4,12})["']/gi,
          /data-id=["'](\d{4,12})["'][^>]*class=["'][^"']*question/gi
        ];
        const qSet = new Set();
        for (const pat of qPatterns) {
          let m; pat.lastIndex = 0;
          while ((m = pat.exec(qHtml)) !== null) qSet.add(Number(m[1]));
        }
        questionIds = [...qSet].slice(0, 1); // one question per assignment (competitor pattern)
        console.log('[Moeen-2] Homework: AddQuestionListPaging found', qSet.size, 'question(s) → using:', questionIds);
      } catch (e) {
        console.warn('[Moeen-2] Homework: AddQuestionListPaging failed', e);
      }
      if (questionIds.length === 0) {
        console.warn('[Moeen-2] Homework: no IEN questions for lesson', lessonIdStr, '— will create assignment without questions');
      }

      // 4. POST to the live UI route:
      //    /Teacher/Assignments/Manage?isNotUserLayout=True&selectedSubjectId=<subject>
      //    Notes: "X-Requested-With" IS also in body (Madrasati quirk); empty key quirk preserved.
      const manageBody = new URLSearchParams(homeworkManageDefaults.toString());
      function _setManage(name, value) { manageBody.set(name, value); }
      _setManage('__RequestVerificationToken', csrfToken);
      _setManage('Grade', '1');
      _setManage('SaveButton', '');
      _setManage('IdEnc', manageBody.get('IdEnc') || '');
      _setManage('Id', manageBody.get('Id') || '0');
      _setManage('TreeId', lessonIdStr);
      _setManage('IsTreeLevel', 'false');
      _setManage('IsQuran', 'false');
      _setManage('txt_UploadUrl', '/Teacher/Assignments/UploadFile');
      _setManage('SelectedUnitId', subjectIdStr);
      _setManage('SelectedTrees_2', chapterIdStr);
      _setManage('SelectedTrees_3', lessonIdStr);
      _setManage('selectedSubjectId', subjectIdStr);
      _setManage('selectedTreeId', chapterIdStr);
      _setManage('selectedLessonse', lessonIdStr);
      _setManage('isNotUserLayout', 'True');
      _setManage('Name', 'واجب (' + lessonName + ')');
      _setManage('QuranLessonType', '1');
      _setManage('QuranLessonId', '');
      // Use IEN question-bank type (3) only when questions are available;
      // fall back to traditional assignment type (1) when the bank is empty.
      const _useIen = questionIds.length > 0;
      _setManage('AssignmentType', _useIen ? '3' : '1');
      manageBody.append('', '');  // Madrasati quirk: empty key+value pair
      _setManage('Description', _useIen ? '' : 'قم بحل أسئلة الدرس المحددة من كتاب الطالب وتسليم الإجابة داخل النظام.');
      _setManage('filePath', '');
      _setManage('PageNumber', _useIen ? '' : '13');
      _setManage('QuestionsNumber', _useIen ? '' : '1');
      _setManage('SolvingType', _useIen ? '4' : '2');
      _setManage('AccessType', _useIen ? 'True' : 'False');
      _setManage('schoolId', schoolId);
      _setManage('hfLevelsCount', '3');
      _setManage('hfDrawTree', manageBody.get('hfDrawTree') || '/Teacher/Assignments/DrawTreeToClassLesson');
      _setManage('X-Requested-With', 'XMLHttpRequest'); // Madrasati quirk: also in body!
      questionIds.forEach(function (qId, i) {
        manageBody.append('AssignmentQuestionsList[' + i + '].Id', String(qId));
        manageBody.append('AssignmentQuestionsList[' + i + '].Grade', '1');
        manageBody.append('AssignmentQuestionsList[' + i + '].IsIenQuestion', 'True');
      });
      manageBody.append('IsEditDraft', 'False');
      manageBody.append('IsDraft', 'false');

      try {
        const manageUrl = homeworkManagePostUrl || ('/Teacher/Assignments/Manage?isNotUserLayout=True&selectedSubjectId=' + encodeURIComponent(subjectIdStr));
        const manageRes = await fetch(manageUrl, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'requestverificationtoken': csrfToken
          },
          body: manageBody.toString()
        });
        const manageText = await manageRes.text();
        try {
          const j = JSON.parse(manageText);
          if (j && (j.success === false || j.Success === false)) {
            console.warn('[Moeen-2] Homework Manage returned success:false →', JSON.stringify(j).slice(0, 200));
            return '';
          }
        } catch (e) { }
        if (!manageRes.ok) {
          console.warn('[Moeen-2] Homework: Manage POST status', manageRes.status); return '';
        }
        const manageIdMatch = manageText.match(/(?:AssignmentId|assignmentId)["':=\s]+(\d{6,12})/i)
          || manageText.match(/assignmentId_(\d{6,12})/i)
          || manageText.match(/checkAssignment\(\s*this\s*,\s*(\d{6,12})\s*\)/i);
        const urlIdMatch = (manageRes.url || '').match(/[?&](?:assignmentId|IdEnc)=([A-Za-z0-9]{6,})/i);
        if (manageIdMatch && manageIdMatch[1]) {
          manageResponseAssignmentId = String(manageIdMatch[1]);
          console.log('[Moeen-2] Homework Manage response exposed AssignmentId:', manageResponseAssignmentId, '— waiting for GetAssignmentsList confirmation before linking.');
        } else if (urlIdMatch && /^\d{6,12}$/.test(urlIdMatch[1])) {
          manageResponseAssignmentId = String(urlIdMatch[1]);
          console.log('[Moeen-2] Homework Manage redirect URL exposed AssignmentId:', manageResponseAssignmentId);
        }
        console.log('[Moeen-2] Homework Manage POST accepted (status', manageRes.status + ')' + (_useIen ? ' [IEN]' : ' [type-1]'));
      } catch (e) {
        console.error('[Moeen-2] Homework: Manage POST failed', e); return '';
      }

      // 5. Poll GetAssignmentsList until the new AssignmentId appears, then link it.
      const assignmentId = await _waitForNewHomeworkId(beforeSnap);
      if (!assignmentId) {
        if (manageResponseAssignmentId) {
          console.warn('[Moeen-2] Homework: DIFF did not expose the new assignment, using Manage response AssignmentId fallback:', manageResponseAssignmentId);
          return manageResponseAssignmentId;
        }
        console.warn('[Moeen-2] Homework: DIFF found no new assignment IDs after polling (DB lag or creation rejected)');
        return '';
      }
      console.log('[Moeen-2] ✅ Homework created — AssignmentId:', assignmentId);
      return assignmentId;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // silentCreateExamResource – Session 4 asset
    //
    // Flow:
    //   1. Before snapshot (GetExamsList DIFF baseline)
    //   2. GET /Teacher/Exams/Manage?SchoolId=<hash> → scrape HashKey + CSRF
    //   3. POST GetGoalLessonSubject → GoalIds for this lesson
    //   4. POST ExamQuestionSettings (hardcoded 5-question distribution) → parse IDs
    //   5. POST Exams/Manage (full payload + QuestionsList)
    //   6. Wait 1.5s → after snapshot → DIFF → return numeric ExamId string
    // ─────────────────────────────────────────────────────────────────────────
    async function silentCreateExamResource(subjectId, chapterId, lessonId, lessonName, realSchoolId) {
      const schoolId = String(realSchoolId).trim();
      const subjectIdStr = String(subjectId).trim();
      const lessonIdStr = String(lessonId).trim();
      const chapterIdStr = String(chapterId).trim();
      const examName = 'اختبار (' + lessonName + ')';

      // ── Inner helper: snapshot GetExamsList → Set of numeric Exam IDs ──────
      async function _examSnapshot(label) {
        const body = new URLSearchParams();
        body.append('title', '');
        body.append('lectureExamsList', '');
        body.append('sumLectureExamsGradeBook', '0');
        body.append('selectedUnitId', subjectIdStr);
        body.append('treeId', lessonIdStr);
        body.append('lessonsId[]', lessonIdStr);
        body.append('childOfSubject', chapterIdStr);
        body.append('schoolId', schoolId);
        body.append('accessType', '');
        body.append('createdByme', 'false');
        const snapIds = new Set();
        try {
          const res = await fetch('/Teacher/LectureTools/GetExamsList', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: body.toString()
          });
          let html = await res.text();
          try { const j = JSON.parse(html); if (j && typeof j.html === 'string') html = j.html; } catch (e) { }
          const pats = [
            /id=["'](\d{6,12})["'][^>]*class=["'][^"']*gradeQuestion/gi,
            /class=["'][^"']*gradeQuestion[^"']*["'][^>]*id=["'](\d{6,12})["']/gi,
            /id=["']ExamId_(\d{6,12})["']/gi,
            /data-exam-id=["'](\d{6,12})["']/gi,
            // Confirmed from captured GetExamsList HTML:
            //   id="hfGradeBookTotalValue_112326839" value="...?examId=112326839"
            /hfGradeBookTotalValue_(\d{6,12})/gi,
            /[?&]examId=(\d{6,12})/gi
          ];
          for (const pat of pats) {
            let m; pat.lastIndex = 0;
            while ((m = pat.exec(html)) !== null) snapIds.add(Number(m[1]));
          }
        } catch (e) {
          console.warn('[Moeen-2] Exam snapshot (' + label + ') threw:', e && e.message);
        }
        console.log('[Moeen-2] Exam ' + label + ' snapshot:', snapIds.size, 'exam(s)');
        return snapIds;
      }

      // 1. Before snapshot
      const beforeSnap = await _examSnapshot('before');

      // Reuse existing: if an exam already exists for this lesson, skip creation
      if (beforeSnap.size > 0) {
        const existingId = String([...beforeSnap][0]);
        console.log('[Moeen-2] Exam: existing exam found → reusing ID', existingId, '(skipping creation)');
        return existingId;
      }

      // 2. GET Exams/Manage page → scrape HashKey + __RequestVerificationToken
      let csrfToken = '';
      let hashKey = '';
      let hfDrawTree = '/Exams/DrawTreeToClassLesson';
      try {
        const getRes = await fetch('/Teacher/Exams/Manage?SchoolId=' + encodeURIComponent(schoolId), {
          credentials: 'same-origin'
        });
        const pageHtml = await getRes.text();
        const doc = new DOMParser().parseFromString(pageHtml, 'text/html');
        const hashKeyEl = doc.querySelector('[name="HashKey"]');
        hashKey = hashKeyEl ? (hashKeyEl.value || '') : '';
        if (hashKeyEl) {
          const scopedForm = hashKeyEl.closest('form');
          if (scopedForm) {
            csrfToken = (scopedForm.querySelector('[name="__RequestVerificationToken"]') || {}).value || '';
          }
        }
        if (!csrfToken) {
          const allTokens = doc.querySelectorAll('[name="__RequestVerificationToken"]');
          for (const el of allTokens) {
            if (el.value && el.value.length > 20) { csrfToken = el.value; break; }
          }
        }
        const hfEl = doc.querySelector('[name="hfDrawTree"]');
        if (hfEl && hfEl.value) hfDrawTree = hfEl.value;
        console.log('[Moeen-2] Exam: GET Manage scraped → csrfToken:', csrfToken ? csrfToken.slice(0, 20) + '…' : 'EMPTY',
          '| hashKey:', hashKey ? hashKey.slice(0, 20) + '…' : 'EMPTY');
      } catch (e) {
        console.error('[Moeen-2] Exam: failed GET Manage page:', e && e.message);
        return '';
      }
      if (!csrfToken || !hashKey) {
        console.error('[Moeen-2] Exam: missing CSRF or HashKey — aborting. csrfToken:', !!csrfToken, 'hashKey:', !!hashKey);
        return '';
      }

      // 3. Get GoalIds for this lesson (same pattern as Enrichment)
      let goalIds = [];
      try {
        const goalsRes = await fetch('/LearningResources/MangeResources/GetGoalLessonSubject', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: 'subjectId=' + encodeURIComponent(subjectIdStr)
        });
        const goalsData = await goalsRes.json();
        if (Array.isArray(goalsData)) {
          const lessonIdNum = parseInt(lessonIdStr, 10);
          goalIds = goalsData
            .filter(function (row) { return row && row.GoalId && Number(row.LessonId) === lessonIdNum; })
            .map(function (row) { return row.GoalId; });
          console.log('[Moeen-2] Exam: GoalIds found:', goalIds.length);
        }
      } catch (e) {
        console.warn('[Moeen-2] Exam: failed to fetch GoalIds, proceeding without:', e && e.message);
      }

      // 4. ExamQuestionSettings + Exams/Manage
      //    Hardcoded 5-question distribution from competitor HAR (1 per type/difficulty bucket):
      //      MCQ-easy, MCQ-medium, T/F-easy, T/F-medium, Matching-easy
      const LIST_DIST = [
        { NumberOfQuestions: 1, QuestionTypeCode: 0, DifficultyFactor: 0, itemCount: 1 },
        { NumberOfQuestions: 1, QuestionTypeCode: 0, DifficultyFactor: 1, itemCount: 1 },
        { NumberOfQuestions: 1, QuestionTypeCode: 3, DifficultyFactor: 0, itemCount: 1 },
        { NumberOfQuestions: 1, QuestionTypeCode: 3, DifficultyFactor: 1, itemCount: 1 },
        { NumberOfQuestions: 1, QuestionTypeCode: 6, DifficultyFactor: 0, itemCount: 1 }
      ];

      // Build the shared payload (ExamQuestionSettings + Exams/Manage use identical base)
      function _buildExamBody() {
        const p = new URLSearchParams();
        p.append('__RequestVerificationToken', csrfToken);
        p.append('HashKey', hashKey);
        p.append('Id', '0');
        p.append('LessonParentId', chapterIdStr);
        p.append('TreeId', lessonIdStr);
        p.append('LessonId', lessonIdStr);
        p.append('IsTreeLevel', '');
        p.append('ExamId', '');
        p.append('SchoolId', schoolId);
        p.append('ExamCategory', '3');  // sent twice (quirk)
        p.append('ExamCategory', '');
        p.append('SelectedUnitId', subjectIdStr);
        p.append('SelectedTrees_2', chapterIdStr);
        p.append('SelectedTrees_3', lessonIdStr);
        p.append('Name', examName);
        p.append('ExamType', '2');  // sent twice (quirk)
        p.append('ExamType', '');
        p.append('ExamQuestionSource', 'ien');
        p.append('Description', '');
        p.append('AccessType', 'True');
        p.append('AllowLessonContent', 'true');   // sent twice (quirk)
        p.append('AllowLessonContent', 'false');
        p.append('hfLevelsCount', '3');
        p.append('hfDrawTree', hfDrawTree);
        LIST_DIST.forEach(function (item, i) {
          p.append('List[' + i + '].NumberOfQuestions', String(item.NumberOfQuestions));
          p.append('List[' + i + '].QuestionTypeCode', String(item.QuestionTypeCode));
          p.append('List[' + i + '].DifficultyFactor', String(item.DifficultyFactor));
          p.append('List[' + i + '].itemCount', String(item.itemCount));
        });
        p.append('IsEditDraft', 'False');
        goalIds.forEach(function (gId) { p.append('GoalIds', String(gId)); });
        return p;
      }

      // Call ExamQuestionSettings to get available question IDs per type+difficulty
      const questionsByBucket = {}; // "typeCode:difficulty" → [id, ...]
      try {
        const eqsRes = await fetch('/Teacher/Exams/ExamQuestionSettings', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'requestverificationtoken': csrfToken
          },
          body: _buildExamBody().toString()
        });
        let eqsHtml = await eqsRes.text();
        try { const j = JSON.parse(eqsHtml); if (j && typeof j.html === 'string') eqsHtml = j.html; } catch (e) { }

        // Try rich patterns first (id + typeCode + difficulty on same element)
        const richPats = [
          /data-id=["'](\d{4,12})["'][^>]{0,200}?data-(?:typecode|type-code|questiontype)=["'](\d+)["'][^>]{0,200}?data-(?:difficultyfactor|difficulty-factor|difficulty)=["'](\d+)["']/gi,
          /data-(?:typecode|type-code|questiontype)=["'](\d+)["'][^>]{0,200}?data-(?:difficultyfactor|difficulty-factor|difficulty)=["'](\d+)["'][^>]{0,200}?data-id=["'](\d{4,12})["']/gi,
          /data-qid=["'](\d{4,12})["'][^>]{0,200}?data-type=["'](\d+)["'][^>]{0,200}?data-difficulty=["'](\d+)["']/gi
        ];
        let richFound = false;
        for (const pat of richPats) {
          let m; pat.lastIndex = 0;
          while ((m = pat.exec(eqsHtml)) !== null) {
            richFound = true;
            // Group 1=id, 2=typeCode, 3=difficulty  OR  1=typeCode, 2=difficulty, 3=id
            let qId, typeCode, diff;
            if (pat.source.startsWith('data-id')) {
              qId = m[1]; typeCode = m[2]; diff = m[3];
            } else if (pat.source.startsWith('data-(?:typecode')) {
              typeCode = m[1]; diff = m[2]; qId = m[3];
            } else {
              qId = m[1]; typeCode = m[2]; diff = m[3];
            }
            const key = typeCode + ':' + diff;
            if (!questionsByBucket[key]) questionsByBucket[key] = [];
            questionsByBucket[key].push(Number(qId));
          }
          if (richFound) break;
        }

        // Fallback: plain ID collection (assign in LIST_DIST order)
        if (!richFound) {
          const simIds = [];
          const simPat = /data-(?:questionid|question-id|qid|id)=["'](\d{4,12})["']/gi;
          let m; simPat.lastIndex = 0;
          while ((m = simPat.exec(eqsHtml)) !== null) simIds.push(Number(m[1]));
          simIds.forEach(function (id, idx) {
            if (idx < LIST_DIST.length) {
              const item = LIST_DIST[idx];
              const key = item.QuestionTypeCode + ':' + item.DifficultyFactor;
              if (!questionsByBucket[key]) questionsByBucket[key] = [];
              questionsByBucket[key].push(id);
            }
          });
        }
        console.log('[Moeen-2] Exam: ExamQuestionSettings → buckets found:', Object.keys(questionsByBucket).length);
      } catch (e) {
        console.warn('[Moeen-2] Exam: ExamQuestionSettings threw (will attempt Manage without QuestionsList):', e && e.message);
      }

      // 5. POST Exams/Manage
      const manageBody = _buildExamBody();
      // Append QuestionsList for each bucket that has IDs
      let qIdx = 0;
      LIST_DIST.forEach(function (item) {
        const key = item.QuestionTypeCode + ':' + item.DifficultyFactor;
        const available = (questionsByBucket[key] || []).slice();
        if (available.length > 0) {
          const qId = available[0];
          manageBody.append('QuestionsList[' + qIdx + '].GradeInAssignment', '1');
          manageBody.append('QuestionsList[' + qIdx + '].QuestionTypeCodeNo', String(item.QuestionTypeCode));
          manageBody.append('QuestionsList[' + qIdx + '].DifficultyFactorNo', String(item.DifficultyFactor));
          manageBody.append('QuestionsList[' + qIdx + '].Id', String(qId));
          qIdx++;
        }
      });
      manageBody.append('IsDraft', 'false');
      console.log('[Moeen-2] Exam: Manage POST → Name:', examName, '| questions selected:', qIdx);
      try {
        const manageRes = await fetch('/Teacher/Exams/Manage', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: manageBody.toString()
        });
        const manageText = await manageRes.text();
        try {
          const j = JSON.parse(manageText);
          if (j && (j.success === false || j.Success === false)) {
            console.warn('[Moeen-2] Exam: Manage returned success:false →', JSON.stringify(j).slice(0, 200));
            return '';
          }
        } catch (e) { }
        if (!manageRes.ok) {
          console.warn('[Moeen-2] Exam: Manage POST status', manageRes.status);
          return '';
        }
        console.log('[Moeen-2] Exam: Manage POST accepted (status', manageRes.status + ')');
      } catch (e) {
        console.error('[Moeen-2] Exam: Manage POST failed:', e && e.message);
        return '';
      }

      // 6. DIFF GetExamsList → new ExamId (multi-probe, mirrors homework polling strategy)
      const _examWaitSchedule = [1500, 2000, 4000, 4000, 5000];
      let _examWaitedMs = 0;
      let _examAfterSnap = new Set();
      let _examFoundId = '';
      for (let _ep = 0; _ep < _examWaitSchedule.length; _ep++) {
        await new Promise(function (r) { setTimeout(r, _examWaitSchedule[_ep]); });
        _examWaitedMs += _examWaitSchedule[_ep];
        _examAfterSnap = await _examSnapshot('after-probe-' + (_ep + 1));
        const _newIds = [..._examAfterSnap].filter(function (id) { return !beforeSnap.has(id); });
        if (_newIds.length > 0) {
          // Pick largest (most recently created) in case of race condition
          const _sorted = _newIds.map(function (n) { return BigInt(n); }).sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
          _examFoundId = String(_sorted[0]);
          console.log('[Moeen-2] ✅ Exam DIFF SUCCESS — ExamId:', _examFoundId, 'after', _examWaitedMs, 'ms (' + (_ep + 1) + ' probe(s))');
          break;
        }
        console.warn('[Moeen-2] ⏳ Exam DIFF probe', _ep + 1, '— no new exam ID yet (before=' + beforeSnap.size + ', after=' + _examAfterSnap.size + ')');
      }
      if (!_examFoundId) {
        // Final fallback: if before was empty and after now has entries, return newest
        if (beforeSnap.size === 0 && _examAfterSnap.size > 0) {
          const _arr = [..._examAfterSnap].map(function (n) { return BigInt(n); }).sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
          _examFoundId = String(_arr[0]);
          console.warn('[Moeen-2] Exam DIFF timed out; scoped list has', _examAfterSnap.size, 'exam(s) — using newest:', _examFoundId);
        } else {
          console.warn('[Moeen-2] Exam: DIFF found no new exam IDs after polling (DB lag or creation rejected) — returning empty');
          return '';
        }
      }
      const examId = _examFoundId;
      console.log('[Moeen-2] ✅ Exam created — ExamId:', examId);
      return examId;
    }

    function _sanitizeFilename(str) {
      if (!str) return "lesson";
      return String(str)
        .replace(/[\\\/:*?"<>|]/g, "_")
        .replace(/\s+/g, "_")
        .replace(/_{2,}/g, "_")
        .slice(0, 120);
    }

    async function bulkDownloadAllLecturePDFs(opts) {
      opts = opts || {};
      const delayMs = opts.delayMs || 2500;

      // 1. نجيب كل الكروت الخضراء
      const cards = Array.from(document.querySelectorAll("div.cs-lesson-card"))
        .filter(c => c.querySelector(".schedule-card.done") || c.classList.contains("Moeen-2-processed"));

      if (!cards.length) {
        console.warn("[Moeen-2-Bulk] مفيش دروس محضرّة (خضراء) في الصفحة دي.");
        return;
      }

      console.log(`[Moeen-2-Bulk] جاري العمل على ${cards.length} درس...`);

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const lessonTitle = card.querySelector("h2")?.textContent.trim() || "lesson";
        console.log(`[${i + 1}/${cards.length}] جاري معالجة: ${lessonTitle}`);

        try {
          // 2. ندور على رابط صفحة التفاصيل (الرابط اللي بيوديك لصفحة الدرس)
          const detailsLink = card.querySelector("a")?.href;
          if (!detailsLink) continue;

          // 3. نفتح صفحة التفاصيل في الخلفية
          const response = await fetch(detailsLink);
          const html = await response.text();

          // 4. ندور جوه صفحة التفاصيل على زرار الطباعة الأصلي
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const printBtn = doc.querySelector("a[href*='PrintLecture']");

          if (printBtn) {
            const printUrl = new URL(printBtn.href, window.location.origin).href;

            // 5. نحمل صفحة الطباعة
            const printRes = await fetch(printUrl);
            const printHtml = await printRes.text();

            // 6. حفظ الملف
            const blob = new Blob([printHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${_sanitizeFilename(lessonTitle)}__${i + 1}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log(`%c [✓] تم حفظ: ${lessonTitle}`, "color: green");
          } else {
            console.warn(`[!] ملقيتش زرار طباعة جوه درس: ${lessonTitle}`);
          }

        } catch (err) {
          console.error(`[X] فشل في معالجة ${lessonTitle}:`, err);
        }

        // تأخير عشان السيرفر ميزعلش
        await new Promise(r => setTimeout(r, delayMs));
      }
      console.log("[Moeen-2-Bulk] مبروك يا هندسة.. الداتا بقت عندك!");
    }

    // Expose for manual invocation from DevTools console
    window.bulkDownloadAllLecturePDFs = bulkDownloadAllLecturePDFs;

    async function silentPrepareLesson(token, selection, passedSubjectId, realSchoolId, lessonCardDiv) {
      const ids = selection.treeValue.split(',');
      if (ids.length < 3) return false;

      // treeValue IDs are ALWAYS used for Activity POST and SaveLastLessonPlan
      // passedSubjectId is only used for ManageLecture URL (CSRF scraping)
      const treeSubjectId = ids[0];   // SelectedUnitId for Activity POST
      const finalSubjectId = passedSubjectId || treeSubjectId; // for ManageLecture URL only
      const chapterId = ids[1];
      const lessonId = ids[2];
      const lessonName = selection.treeText.trim().replace(':', '');

      // 1. Build the ManageLecture URL (use anchor if present, else construct from data-* for blue lessons)
      const cell = lessonCardDiv.closest('td') || lessonCardDiv.parentElement;
      let scrapeUrl = "";
      const anchor = cell ? cell.querySelector('a[href*="ManageLecture"]') : null;

      if (anchor && anchor.href) {
        scrapeUrl = anchor.href;
      } else {
        const dsId = lessonCardDiv.getAttribute('data-subject-id') || passedSubjectId;
        const dcId = lessonCardDiv.getAttribute('data-class-id') || lessonCardDiv.getAttribute('data-classroom-id');
        // The lesson `token` is the canonical TimeTableId/lectureId; data-lecture-id can be the
        // slot index (e.g. "2"), which is wrong for ManageLecture.
        const dlId = token || lessonCardDiv.getAttribute('data-lecture-id');

        if (dsId && dcId && dlId && realSchoolId) {
          scrapeUrl = window.location.origin + "/SchoolSchedule/Schedule/ManageLecture?SchoolId=" + encodeURIComponent(realSchoolId) + "&lectureId=" + encodeURIComponent(dlId) + "&subjectId=" + encodeURIComponent(dsId) + "&classroomId=" + encodeURIComponent(dcId);
        }
      }

      if (!scrapeUrl) {
        console.error("[Moeen-2] ManageLecture link not found and could not be built for this cell", lessonCardDiv);
        return false;
      }

      // ─── Resource selection — read teacher's checkbox choices from panel.
      // Failsafe: if ALL four are disabled, still run Activity so the server
      // validation (requires ≥1 resource) does not block the save.
      const _resActivity = getResourceEnabled('activity');
      const _resHomework = getResourceEnabled('homework');
      const _resExam = getResourceEnabled('exam');
      const _resEnrichment = getResourceEnabled('enrichment');
      const _anyOtherEnabled = _resHomework || _resExam || _resEnrichment;
      const _shouldRunActivity = _resActivity || !_anyOtherEnabled;
      console.log('[Moeen-2] Resource toggles — نشاط:', _shouldRunActivity, ' واجب:', _resHomework, ' اختبار:', _resExam, ' إثراء:', _resEnrichment);

      // ─── Step 1 of DIFF strategy: capture BEFORE snapshot of existing Projects for this scope.
      //     We capture it BEFORE Activity Create so we can detect the new ID afterwards.
      //     Skip entirely when Activity is not being created (avoids useless network call).
      const beforeSnapshot = _shouldRunActivity ? await fetchProjectsListSnapshot('before-create') : new Set();
      if (_shouldRunActivity) {
        console.log('[Moeen-2] DIFF baseline captured:', beforeSnapshot.size, 'existing project IDs');
      }

      // Create the Activity FIRST — before any ManageLecture fetch that could invalidate the HashKey
      let activityCreated = true;
      if (_shouldRunActivity) {
        activityCreated = await silentCreateActivityResource(treeSubjectId, chapterId, lessonId, lessonName, realSchoolId, null);
        console.log('[Moeen-2] Activity created:', activityCreated);
        if (!activityCreated) {
          console.error("[Moeen-2] Activity creation failed - aborting lesson save.");
          return false;
        }
      } else {
        console.log('[Moeen-2] Activity (نشاط) skipped — disabled by teacher.');
      }

      // Kick off Enrichment + Homework concurrently with the DB sync polling below.
      // Both run independently — neither their result nor their ID is needed until SaveLastLessonPlan.
      // Fail-soft: if either fails it logs a warning but the lesson save continues.
      const _enrichmentPromise = _resEnrichment
        ? silentCreateEnrichmentResource(treeSubjectId, chapterId, lessonId, lessonName, realSchoolId)
          .catch(function (e) { console.warn('[Moeen-2] Enrichment creation threw:', e && e.message); return ''; })
        : Promise.resolve('');
      const _homeworkPromise = _resHomework
        ? silentCreateHomeworkResource(treeSubjectId, chapterId, lessonId, lessonName, realSchoolId)
          .catch(function (e) { console.warn('[Moeen-2] Homework creation threw:', e && e.message); return ''; })
        : Promise.resolve('');
      const _examPromise = _resExam
        ? silentCreateExamResource(treeSubjectId, chapterId, lessonId, lessonName, realSchoolId)
          .catch(function (e) { console.warn('[Moeen-2] Exam creation threw:', e && e.message); return ''; })
        : Promise.resolve('');

      // CRITICAL DB sync — Madrasati's GetProjectsList lags 1-15s behind the
      // Activity Create POST depending on server load. We poll up to 5 times
      // with exponential backoff: 1s, 2s, 4s, 4s, 4s (≈15s worst case).
      // Only runs when Activity was actually created.
      var _diffWaitSchedule = [1000, 2000, 4000, 4000, 4000];
      var _diffAttempts = 0;
      var _diffSucceeded = false;
      var _confirmedAfterSnapshot = null;
      if (_shouldRunActivity) {
        for (var _attemptIdx = 0; _attemptIdx < _diffWaitSchedule.length; _attemptIdx++) {
          await new Promise(r => setTimeout(r, _diffWaitSchedule[_attemptIdx]));
          _diffAttempts++;
          try {
            var _probeSnapshot = await fetchProjectsListSnapshot('probe-' + _diffAttempts);
            var _probeNewIds = [..._probeSnapshot].filter(id => !beforeSnapshot.has(id));
            if (_probeNewIds.length > 0) {
              console.log('[Moeen-2] ✅ DB sync probe attempt', _diffAttempts, 'detected', _probeNewIds.length, 'new project ID(s) after', _diffWaitSchedule.slice(0, _attemptIdx + 1).reduce(function (a, b) { return a + b; }, 0), 'ms total wait — proceeding to single Tier-A DIFF below');
              _diffSucceeded = true;
              _confirmedAfterSnapshot = _probeSnapshot;
              break;
            } else {
              console.warn('[Moeen-2] ⏳ DB sync probe attempt', _diffAttempts, '— no new ID yet (size=' + _probeSnapshot.size + ', baseline=' + beforeSnapshot.size + '). Will retry.');
            }
          } catch (_probeErr) {
            console.warn('[Moeen-2] DB sync probe attempt', _diffAttempts, 'threw:', _probeErr && _probeErr.message);
          }
        }
        if (!_diffSucceeded) {
          console.error('[Moeen-2] ❌ DB sync polling exhausted after', _diffAttempts, 'attempts. Tier-A DIFF will likely fail; falling through to Tier-B (HTML scrape) and Tier-C (Projects/Index).');
        }
      } else {
        _diffSucceeded = false; // activity was skipped — no DIFF needed
      }

      // Collect Enrichment + Homework + Exam results (all three were running concurrently)
      const enrichmentActivityId = await _enrichmentPromise;
      const homeworkAssignmentId = await _homeworkPromise;
      const examId = await _examPromise;
      console.log('[Moeen-2] Enrichment activity ID:', enrichmentActivityId || '(none — enrichment not linked to lecture)');
      console.log('[Moeen-2] Homework AssignmentId:', homeworkAssignmentId || '(none — will save without assignment)');
      console.log('[Moeen-2] Exam ExamId:', examId || '(none — will save without exam)');

      // 3a. Call MlutiLessonPlan to get NUMERIC SchoolId + TimeTableId for SaveLastLessonPlan.
      // The `token` is the card's `data-data` encrypted blob. Posting it to MlutiLessonPlan
      // returns a server-rendered form with all the numeric IDs SaveLastLessonPlan requires.
      let mlutiFormData = null;
      const looksLikeBlob = (v) => {
        if (!v) return false;
        const s = String(v).trim();
        if (/^\d{1,5}$/.test(s)) return false; // slot index, not a blob
        return s.length >= 16;
      };
      if (looksLikeBlob(token)) {
        try {
          const mlutiCsrf = getCsrfToken();
          const mlutiBody = new URLSearchParams();
          mlutiBody.append('Data', token);
          const mlutiRes = await fetch('/Teacher/Lessons/MlutiLessonPlan', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
              'requestverificationtoken': mlutiCsrf
            },
            body: mlutiBody.toString()
          });
          const mlutiHtml = await mlutiRes.text();
          const mlutiDoc = new DOMParser().parseFromString(mlutiHtml, 'text/html');
          const mlutiInputs = mlutiDoc.querySelectorAll('input[type="hidden"]');
          if (mlutiInputs.length > 3) {
            mlutiFormData = new FormData();
            mlutiInputs.forEach(inp => { if (inp.name) mlutiFormData.set(inp.name, inp.value); });
            console.log('[Moeen-2] MlutiLessonPlan OK — SchoolId:', mlutiFormData.get('SchoolId'), 'TimeTableId:', mlutiFormData.get('TimeTableId'), 'fields:', mlutiInputs.length);
          } else {
            console.warn('[Moeen-2] MlutiLessonPlan returned too few hidden inputs:', mlutiInputs.length, '— snippet:', mlutiHtml.slice(0, 200));
          }
        } catch (e) {
          console.warn('[Moeen-2] MlutiLessonPlan fetch failed:', e);
        }
      } else {
        console.warn('[Moeen-2] token is not a blob — skipping MlutiLessonPlan. token:', String(token || '').slice(0, 20));
      }

      // 3b. Resolve the just-created Activity's ProjectId via a layered probe.
      // Confirmed via prior diagnostics:
      //   - /Projects/Projects/Index/{schoolId} returns only the navbar/page shell (no project IDs in HTML).
      //   - /Teacher/LectureTools/GetActivitiesList → 302 to NotPermitted (forbidden for this role).
      //   - Activity POST returns success but does not echo back the new ProjectId.
      // Strategy: try three sources in order; first numeric ID wins.
      let activityProjectId = '';

      // ─── Helper: call GetProjectsList and return Set of all numeric Project IDs in the response.
      //    Used twice (before + after Activity Create) to compute the diff.
      async function fetchProjectsListSnapshot(label) {
        const body = new URLSearchParams();
        body.append('title', '');
        body.append('lectureProjectsList', '');
        body.append('sumLectureProjectsGradeBook', '0');
        body.append('selectedUnitId', String(finalSubjectId).trim());
        body.append('treeId', String(lessonId).trim());
        body.append('lessonsId[]', String(lessonId).trim());
        body.append('childOfSubject', String(chapterId).trim());
        body.append('accessType', '');
        body.append('createdByme', 'false');
        body.append('schoolId', String(realSchoolId).trim());

        const snapIds = new Set();
        try {
          const res = await fetch('/Teacher/LectureTools/GetProjectsList', {
            method: 'POST',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'Accept': '*/*',
              'X-Requested-With': 'XMLHttpRequest',
              'Origin': 'https://schools.madrasati.sa',
              'Referer': location.href
            },
            body: body.toString()
          });
          if (res.status >= 200 && res.status < 400) {
            const bodyText = await res.text();
            let htmlInner = bodyText;
            try {
              const j = JSON.parse(bodyText);
              if (j && typeof j.html === 'string') htmlInner = j.html;
            } catch (_) { }
            // The relevant IDs are on the <a class="selectProject" id="<numeric>">
            // and also in setDefaultDates(<numeric>) onclick handlers.
            const patterns = [
              /class=["'][^"']*selectProject[^"']*["'][^>]*id=["'](\d{6,12})["']/gi,
              /id=["'](\d{6,12})["'][^>]*class=["'][^"']*selectProject/gi,
              /setDefaultDates\(\s*["']?(\d{6,12})["']?\s*\)/g,
              /\/Projects\/Projects\/(?:Edit|Delete|Details|Show)\/(\d{6,12})/g,
              /name=["']LectureProjectsList\[\d+\]\.ProjectId["'][^>]*value=["'](\d{6,12})["']/gi,
              /value=["'](\d{6,12})["'][^>]*name=["']LectureProjectsList\[\d+\]\.ProjectId["']/gi
            ];
            for (const re of patterns) {
              let m;
              while ((m = re.exec(htmlInner)) !== null) snapIds.add(m[1]);
            }
            console.log('[Moeen-2] GetProjectsList snapshot [' + label + ']: status=' + res.status + ', candidates=' + snapIds.size);
          } else {
            console.warn('[Moeen-2] GetProjectsList snapshot [' + label + ']: non-2xx status=' + res.status);
          }
        } catch (e) {
          console.warn('[Moeen-2] GetProjectsList snapshot [' + label + '] threw:', e && e.message);
        }
        return snapIds;
      }

      // ─── Tier A/B/C: ProjectId resolution — only runs when Activity was actually created.
      // IMPORTANT: when Activity is disabled _shouldRunActivity=false, beforeSnapshot is an
      // empty Set(). Running the diff then would classify ALL existing projects as "new",
      // wrongly setting activityProjectId to a stale ID and injecting an unwanted activity.
      if (_shouldRunActivity) {

        // ─── Tier A: DIFF-BASED ProjectId resolution (single-attempt version).
        //
        //   We already captured `beforeSnapshot` BEFORE silentCreateActivityResource.
        //   DB polling already produced a confirmed `afterSnapshot`; reuse it
        //   instead of making the same network request a second time.
        //   The new entry IS our newly-created Activity's ProjectId.
        try {
          const afterSnapshot = _confirmedAfterSnapshot || await fetchProjectsListSnapshot('after-create');
          const newIds = [...afterSnapshot].filter(id => !beforeSnapshot.has(id));

          if (newIds.length === 1) {
            activityProjectId = newIds[0];
            console.log('[Moeen-2] ✅ Tier-A DIFF SUCCESS — new ProjectId:', activityProjectId,
              '(before:', beforeSnapshot.size, 'after:', afterSnapshot.size, ')');
          } else if (newIds.length > 1) {
            // Race condition (another teacher created an Activity in the same scope in this exact 2-3s window).
            // Pick the largest BigInt as a tiebreaker — our Activity is almost certainly the most recent.
            const sorted = newIds.map(s => BigInt(s)).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
            activityProjectId = String(sorted[0]);
            console.warn('[Moeen-2] ⚠️ Tier-A DIFF: ' + newIds.length + ' new IDs (race condition?). Picked largest:', activityProjectId, 'all new:', newIds);
          } else if (afterSnapshot.size === beforeSnapshot.size) {
            // No new ID — Activity Create may have failed silently.
            console.error('[Moeen-2] ❌ Tier-A DIFF: no new ID detected (before=' + beforeSnapshot.size + ', after=' + afterSnapshot.size + '). Activity Create likely failed server-side despite returning success.');
          } else {
            console.warn('[Moeen-2] ⚠️ Tier-A DIFF: unexpected state. before=' + beforeSnapshot.size + ' after=' + afterSnapshot.size + ' newIds=' + newIds.length);
          }
        } catch (e) {
          console.warn('[Moeen-2] Tier-A diff threw:', e && e.message);
        }

        // ─── Tier B Scrape ManageLecture HTML
        if (!activityProjectId) {
          try {
            let mlHtml = (typeof dashboardManageLectureHtml === 'string' && dashboardManageLectureHtml.length > 0)
              ? dashboardManageLectureHtml
              : '';
            if (!mlHtml) {
              const mlScrapeUrl = (typeof scrapeUrl === 'string' && scrapeUrl) ? scrapeUrl : '';
              if (mlScrapeUrl) {
                const mlRes = await fetch(mlScrapeUrl, { credentials: 'same-origin' });
                if (mlRes.ok) mlHtml = await mlRes.text();
              }
            }
            if (mlHtml) {
              const candidates = new Set();
              const patterns = [
                /name=["']LectureProjectsList\[\d+\]\.ProjectId["'][^>]*value=["'](\d{5,12})["']/g,
                /value=["'](\d{5,12})["'][^>]*name=["']LectureProjectsList\[\d+\]\.ProjectId["']/g,
                /<option[^>]*value=["'](\d{5,12})["'][^>]*selected/g,
                /data-project-id=["'](\d{5,12})["']/g,
                /ProjectId["']?\s*:\s*["']?(\d{5,12})/g
              ];
              for (const re of patterns) {
                let m;
                while ((m = re.exec(mlHtml)) !== null) candidates.add(m[1]);
              }
              if (candidates.size > 0) {
                const sorted = [...candidates].map(s => BigInt(s)).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
                activityProjectId = String(sorted[0]);
              }
            }
          } catch (e) { }
        }

        // ─── Tier C Scrape Projects/Index
        if (!activityProjectId) {
          try {
            const indexUrl = `/Projects/Projects/Index/${encodeURIComponent(realSchoolId)}?hfLevelsCount=3`;
            const projRes = await fetch(indexUrl, { credentials: 'same-origin' });
            if (projRes.ok) {
              const html = await projRes.text();
              const idCandidates = new Set();
              const patterns = [
                /data-id=["'](\d{5,12})["']/g,
                /\/Projects\/Projects\/(?:Edit|Delete|Details)\/(\d{5,12})/g,
                /ProjectId["']?\s*[:=]\s*["']?(\d{5,12})/g,
                /name=["']ProjectId["'][^>]*value=["'](\d{5,12})["']/g,
                /value=["'](\d{5,12})["'][^>]*name=["']ProjectId["']/g,
                /<input[^>]+id=["']ProjectId_(\d{5,12})["']/g
              ];
              for (const re of patterns) {
                let m;
                while ((m = re.exec(html)) !== null) idCandidates.add(m[1]);
              }
              if (idCandidates.size > 0) {
                const sorted = [...idCandidates].map(s => BigInt(s)).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
                activityProjectId = String(sorted[0]);
              }
            }
          } catch (e) { }
        }

        if (activityProjectId) {
          console.log('[Moeen-2] ✅ Final ProjectId for SaveLastLessonPlan:', activityProjectId);
        } else {
          console.warn('[Moeen-2] ❌ No ProjectId resolved from any tier — SaveLastLessonPlan will be sent without it.');
        }
      } else {
        console.log('[Moeen-2] ProjectId resolution skipped — Activity (\u0646\u0634\u0627\u0637) disabled by teacher.');
      }

      // 3c. NOW fetch ManageLecture for the SaveLastLessonPlan CSRF (after Activity is safely created)
      let formHtml = "";
      let finalUrl = scrapeUrl;
      try {
        const formRes = await fetch(scrapeUrl, { credentials: "same-origin" });
        formHtml = await formRes.text();
        finalUrl = formRes.url;
      } catch (e) {
        console.error("[Moeen-2] Failed to fetch ManageLecture page", e);
        return false;
      }

      // ── Diagnostic only — do not change behavior ────────────────────
      console.log("[Moeen-2-DIAG] ManageLecture fetch →",
        "scrapeUrl:", scrapeUrl,
        "| finalUrl:", finalUrl,
        "| activityPostedToSchoolId:", realSchoolId);
      try {
        const finalSchoolMatch = String(finalUrl || "").match(/[?&]SchoolId=([a-f0-9]{32})/i);
        const trueSchoolId = finalSchoolMatch ? finalSchoolMatch[1] : null;
        if (trueSchoolId && trueSchoolId.toLowerCase() !== String(realSchoolId).toLowerCase()) {
          console.warn(
            "[Moeen-2-DIAG] *** SchoolId MISMATCH ***\n" +
            "  posted activity under: " + realSchoolId + "\n" +
            "  ManageLecture's true school: " + trueSchoolId + "\n" +
            "  This is the ARCHITECTURE.md §3 multi-school case. Save will likely 302 to NotPermitted."
          );
        } else if (trueSchoolId) {
          console.log("[Moeen-2-DIAG] SchoolId match OK:", trueSchoolId);
        } else {
          console.log("[Moeen-2-DIAG] No SchoolId in finalUrl. finalUrl was:", finalUrl);
        }
      } catch (e) { /* diagnostic only */ }

      const doc = new DOMParser().parseFromString(formHtml, "text/html");
      let freshCsrf = doc.querySelector('input[name="__RequestVerificationToken"]')?.value;

      if (!freshCsrf) {
        freshCsrf = getCsrfToken();
        console.warn("[Moeen-2] ManageLecture redirected — using dashboard CSRF as fallback.");
      }

      if (!freshCsrf) {
        console.error("[Moeen-2] CSRF token not found. Aborting.");
        return false;
      }

      // The successful diff probe proves that Madrasati can already read the
      // committed Activity. Keep a small fallback buffer only when all probes
      // failed; otherwise this fixed wait costs two seconds per lesson for no gain.
      if (_shouldRunActivity && !_diffSucceeded) {
        await new Promise(r => setTimeout(r, 2000));
      }

      // 4. Build the SaveLastLessonPlan payload.
      // Prefer mlutiFormData (has NUMERIC SchoolId + TimeTableId from server).
      // Fall back to ManageLecture hidden-input scrape if MlutiLessonPlan failed.
      const finalForm = new FormData();
      if (mlutiFormData) {
        for (const [k, v] of mlutiFormData.entries()) { finalForm.set(k, v); }
        console.log('[Moeen-2] Base FormData from MlutiLessonPlan. SchoolId:', finalForm.get('SchoolId'), 'TimeTableId:', finalForm.get('TimeTableId'));
      } else {
        console.warn('[Moeen-2] mlutiFormData null — falling back to ManageLecture scrape.');
        const hiddenInputs = doc.querySelectorAll('form input[type="hidden"]');
        hiddenInputs.forEach(input => { if (input.name) finalForm.set(input.name, input.value); });
      }

      // The ManageLecture page ALREADY rendered the correct, encrypted TimeTableId
      // as a hidden input (scraped above into finalForm at lines ~1428-1432).
      // Do NOT overwrite it from the URL — for Blue cards we manually built that URL
      // with `lectureId = data-lecture-id` (the slot index "1"/"2"/"3"/"4"), which is
      // NOT a valid TimeTableId. Slot index sent as TimeTableId resolves to a
      // foreign school's row, causing /Errors/NotPermitted.
      const scrapedTimeTableId = finalForm.get('TimeTableId');
      const looksLikeRealToken = (v) => {
        if (!v) return false;
        const s = String(v).trim();
        // Real TimeTableId tokens we have observed are 32+ char hex/uppercase strings.
        // Anything 1-3 chars that's purely numeric is the slot index, not a token.
        if (/^\d{1,3}$/.test(s)) return false;
        return s.length >= 16;
      };

      const classroomIdMatch = (scrapeUrl || "").match(/[?&]classroomId=([^&]+)/i);
      const classroomId = classroomIdMatch ? classroomIdMatch[1] : "";

      let finalTimeTableId = "";
      if (mlutiFormData && mlutiFormData.get('TimeTableId')) {
        // MlutiLessonPlan returned a numeric TimeTableId (e.g. "17886178").
        // Do NOT run it through looksLikeRealToken — numeric IDs are short (≈8 digits)
        // and would fail the length >= 16 check.
        finalTimeTableId = String(mlutiFormData.get('TimeTableId')).trim();
        console.log('[Moeen-2] Using TimeTableId from MlutiLessonPlan:', finalTimeTableId);
      } else if (looksLikeRealToken(scrapedTimeTableId)) {
        finalTimeTableId = scrapedTimeTableId;
        console.log("[Moeen-2] Using TimeTableId from ManageLecture hidden input:", finalTimeTableId.slice(0, 16) + "...");
      } else if (looksLikeRealToken(token)) {
        // token came from data-data on Green cards — that IS the encrypted hash.
        finalTimeTableId = token;
        console.log("[Moeen-2] Using TimeTableId from card data-data attr:", finalTimeTableId.slice(0, 16) + "...");
      } else {
        console.error(
          "[Moeen-2] Could NOT obtain a valid TimeTableId.\n" +
          "  mlutiFormData TimeTableId:", mlutiFormData && mlutiFormData.get('TimeTableId'), "\n" +
        "  scraped from ManageLecture hidden input:", scrapedTimeTableId, "\n" +
        "  token (data-data) passed in:", token, "\n" +
        "  scrapeUrl:", scrapeUrl, "\n" +
        "This is a Blue card whose ManageLecture page redirected. Aborting.",
          lessonCardDiv
        );
        return false;
      }

      // Force TimeTableId, classroomId — but TimeTableId now uses the validated value.
      finalForm.set('TimeTableId', finalTimeTableId);
      if (classroomId) finalForm.set('classroomId', classroomId);

      // ── DO NOT OVERWRITE SchoolId UNCONDITIONALLY ────────────────────
      // The ManageLecture form's hidden <input name="SchoolId"> contains
      // the NUMERIC internal school id (e.g. "162189") that
      // /Teacher/Lessons/SaveLastLessonPlan requires. Our `realSchoolId`
      // is the 32-hex HASH form (e.g. "6E91EFB4...") which the Activity
      // /Projects/Projects/Create endpoint accepts but SaveLastLessonPlan
      // rejects (302 → /Errors/NotPermitted).
      // The hidden-inputs scrape at line 1457 already put the numeric
      // value into finalForm. We only fall back to realSchoolId if the
      // scrape produced nothing (defensive).
      const scrapedSchoolId = finalForm.get('SchoolId');
      if (!scrapedSchoolId || String(scrapedSchoolId).trim() === '') {
        console.warn("[Moeen-2] No SchoolId in scraped ManageLecture form — falling back to realSchoolId (hash). SaveLastLessonPlan may reject this.");
        finalForm.set('SchoolId', realSchoolId);
      } else {
        console.log("[Moeen-2] Using NUMERIC SchoolId from ManageLecture form:", scrapedSchoolId, "(NOT overwriting with hash:", realSchoolId + ")");
      }

      // Pin the CSRF to the one we scraped from the ManageLecture page
      finalForm.set('__RequestVerificationToken', freshCsrf);

      console.log("[Moeen-2] SaveLastLessonPlan — TimeTableId:", finalTimeTableId, "classroomId:", classroomId, "SchoolId(form):", finalForm.get('SchoolId'), "realSchoolId(hash):", realSchoolId);

      // 3. Inject our lesson selections
      // CRITICAL: Madrasati requires BOTH SubjectId AND SelectedUnitId — they map to different
      // server-side validators. Missing SelectedUnitId returns 400 with the message
      // "لا يمكن ترك حقل مسار الدرس بدون اختيار".
      deleteFormDataPrefix(finalForm, 'LessonIds[');
      finalForm.set('SubjectId', String(finalSubjectId).trim());
      finalForm.set('SelectedUnitId', String(finalSubjectId).trim());
      finalForm.set('LessonIds[0].Id', String(lessonId).trim());
      finalForm.set('LessonIds[0].Name', lessonName);
      finalForm.set('SelectedTrees_2', String(chapterId).trim());
      finalForm.set('SelectedTrees_3', String(lessonId).trim());
      finalForm.set('TreeCodeTypeIsLesson', 'true');

      // CRITICAL: hfLevelsCount tells the server how many tree levels to bind from
      // the form. The scraped value from MlutiLessonPlan/ManageLecture is "1"
      // (only the subject is known to that page). We always send 3 levels
      // (SubjectId / SelectedTrees_2 / SelectedTrees_3) so this MUST be "3".
      // If it stays at "1", the server ignores SelectedTrees_2 and SelectedTrees_3,
      // leaves the lesson dropdown unselected on re-open, and redirects the POST
      // to ManageLecture (302) — which silentPrepareLesson interprets as failure.
      // Use .set() to OVERRIDE the scraped value (not .append() which would duplicate it).
      finalForm.set('hfLevelsCount', '3');
      console.log('[Moeen-2] ✅ Forced hfLevelsCount=3 for SaveLastLessonPlan (was:', finalForm.getAll('hfLevelsCount').join(',') || 'unset', ')');

      // ── Goals + built-in digital content IDs ────────────────────────────────
      // These are not in ManageLecture HTML. Madrasati expects mirrored repeated
      // fields from GetGoalLessonSubject for:
      //   - "الأهداف التي سيكتسبها الطالب في الدرس"
      //   - "المحتوى الرقمي المرتبط بالدرس"
      const lessonGoalsAndActivities = await fetchLessonGoalsAndActivities(
        finalSubjectId,
        realSchoolId,
        chapterId,
        lessonId
      );
      let viewContentIds = [];
      try {
        const vcUrl = window.location.origin + '/Teacher/Lessons/ViewContent?lessonId=' + encodeURIComponent(lessonId);
        const vcRes = await fetch(vcUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        if (vcRes.ok) {
          const vcText = await vcRes.text();
          const vcDoc = new DOMParser().parseFromString(vcText, 'text/html');
          viewContentIds = extractDigitalActivityIdsFromLessonDocument(vcDoc);
          console.log("[Moeen-2] Scraped ViewContent for digital activities:", viewContentIds);
        } else {
          // Fallback to POST if GET fails
          const vcPostForm = new FormData();
          vcPostForm.append('lessonId', lessonId);
          const vcResPost = await fetch(window.location.origin + '/Teacher/Lessons/ViewContent', {
             method: 'POST',
             body: vcPostForm,
             headers: { 'X-Requested-With': 'XMLHttpRequest' }
          });
          if (vcResPost.ok) {
             const vcText = await vcResPost.text();
             const vcDoc = new DOMParser().parseFromString(vcText, 'text/html');
             viewContentIds = extractDigitalActivityIdsFromLessonDocument(vcDoc);
             console.log("[Moeen-2] Scraped ViewContent (POST) for digital activities:", viewContentIds);
          }
        }
      } catch (e) {
        console.warn("[Moeen-2] Error fetching ViewContent:", e);
      }

      const htmlDigitalActivityIds = extractDigitalActivityIdsFromLessonDocument(doc);
      const playerDigitalIds = await fetchDigitalContentIdsFromPlayer(lessonId, chapterId);

      const mergedDigitalActivityIds = Array.from(new Set(
        lessonGoalsAndActivities.activityIds
          .concat(htmlDigitalActivityIds)
          .concat(viewContentIds)
          .concat(playerDigitalIds)
      ));
      finalForm.delete('LessonGoalsAndActivity[0].lesssonId');
      Array.from(finalForm.keys()).forEach(function (key) {
        if (/^LessonGoalsAndActivity\[0\]\.(?:goalsIds|activityIds)\[\d+\]$/.test(String(key))) {
          finalForm.delete(key);
        }
      });
      finalForm.delete('goals');
      finalForm.delete('activities');
      finalForm.append('LessonGoalsAndActivity[0].lesssonId', String(lessonId).trim());
      lessonGoalsAndActivities.goalIds.forEach(function (goalId, index) {
        finalForm.append('LessonGoalsAndActivity[0].goalsIds[' + index + ']', String(goalId));
        finalForm.append('goals', String(goalId));
      });
      mergedDigitalActivityIds.forEach(function (activityId, index) {
        finalForm.append('LessonGoalsAndActivity[0].activityIds[' + index + ']', String(activityId));
        finalForm.append('activities', String(activityId));
      });

      // Fallback: if no digital content IDs were found from API or HTML scrape,
      // use the lessonId itself as the main lesson content.
      if (mergedDigitalActivityIds.length === 0) {
        finalForm.append('LessonGoalsAndActivity[0].activityIds[0]', String(lessonId).trim());
        finalForm.append('activities', String(lessonId).trim());
        console.warn('[Moeen-2] ⚠️ No real digital activity IDs found for lesson', lessonId,
          '— using lessonId as fallback. This may or may not satisfy the "المحتوى الرقمي" requirement.');
      }

      console.log(
        '[Moeen-2] Bound lesson goals/content — goals:',
        lessonGoalsAndActivities.goalIds.length,
        'digital activities:',
        mergedDigitalActivityIds.length,
        '(api:',
        lessonGoalsAndActivities.activityIds.length,
        'html:',
        htmlDigitalActivityIds.length,
        'player:',
        playerDigitalIds.length,
        'fallback used)'
      );

      // CRITICAL: Madrasati requires LessonType and LessonTempleateType — verified from competitor's
      // successful Save trace. Missing LessonType returns 400 with
      // "لا يمكن ترك حقل نوع الدرس فارغاً".
      //   LessonType=2          → "درس جديد" (new lesson, the default)
      //   LessonTempleateType=1 → standard template ID
      // Use append() — these are NEW fields, not overwrites of fields scraped from MlutiLessonPlan.
      // If MlutiLessonPlan already provided them, the duplicate is harmless (server takes the last).
      if (!finalForm.has('LessonType') || !finalForm.get('LessonType')) {
        finalForm.append('LessonType', '2');
      }
      if (!finalForm.has('LessonTempleateType') || !finalForm.get('LessonTempleateType')) {
        finalForm.append('LessonTempleateType', '1');
      }

      console.log('[Moeen-2] Save form critical fields →',
        'SubjectId:', finalForm.get('SubjectId'),
        'SelectedUnitId:', finalForm.get('SelectedUnitId'),
        'LessonType:', finalForm.get('LessonType'),
        'LessonTempleateType:', finalForm.get('LessonTempleateType'));

      // Core content fields — pull AI-generated text from chrome.storage cache if available.
      // Falls back to hardcoded defaults on any failure (timeout, missing cache, bad shape).
      var aiCached = null;
      try {
        var aiCacheKey = 'Moeen-2_ai_' + String(lessonId).trim();
        aiCached = await new Promise(function (resolve) {
          chrome.storage.local.get([aiCacheKey], function (r) { resolve(r[aiCacheKey] || null); });
        });
      } catch (e) {
        console.warn('[Moeen-2-AI] silentPrepareLesson cache read failed:', e && e.message);
      }

      // Coerce any AI field shape (string | array of strings | array of objects | object)
      // into a single clean Arabic string suitable for FormData.append().
      // GPT-4o-mini occasionally returns LessonVocabulary as an array of objects which
      // produces object text when FormData stringifies it.
      function _aiToString(val, fallback) {
        try {
          if (val == null) return fallback;
          if (typeof val === 'string') return val.trim() || fallback;
          if (Array.isArray(val)) {
            var parts = val.map(function (item) {
              if (item == null) return '';
              if (typeof item === 'string') return item.trim();
              if (typeof item === 'object') {
                // Prefer common term/meaning pairs; fall back to joining all values.
                var keys = Object.keys(item);
                if (keys.length === 0) return '';
                // Build "<key1>: <val1>" if there's a recognizable pair
                var termKey = keys.find(function (k) { return /term|word|كلم|مصطلح/i.test(k); });
                var meanKey = keys.find(function (k) { return /mean|defin|شرح|معنى|تعريف/i.test(k); });
                if (termKey && meanKey) {
                  return String(item[termKey]).trim() + ': ' + String(item[meanKey]).trim();
                }
                // Generic fallback: join all primitive values
                return keys.map(function (k) {
                  var v = item[k];
                  return (v == null || typeof v === 'object') ? '' : String(v).trim();
                }).filter(Boolean).join(' — ');
              }
              return String(item).trim();
            }).filter(Boolean);
            var joined = parts.join(' • ');
            return joined || fallback;
          }
          if (typeof val === 'object') {
            // Plain object — join "key: value" pairs
            var oParts = Object.keys(val).map(function (k) {
              var v = val[k];
              if (v == null || typeof v === 'object') return '';
              return String(k).trim() + ': ' + String(v).trim();
            }).filter(Boolean);
            return oParts.length ? oParts.join(' • ') : fallback;
          }
          // Number / boolean / other primitive
          return String(val).trim() || fallback;
        } catch (e) {
          console.warn('[Moeen-2-AI] aiToString error, using fallback:', e && e.message);
          return fallback;
        }
      }

      var aiPrep = _aiToString(aiCached && aiCached.LectureClassPreparationText, "تمهيد مناسب يربط الدرس بالخبرات السابقة.");
      var aiClose = _aiToString(aiCached && aiCached.LectureClassCloseText, "ملخص شامل لأهم نقاط الدرس.");
      var aiVocab = _aiToString(aiCached && aiCached.LessonVocabulary, "المصطلحات والمفاهيم الأساسية الواردة.");
      var aiThink = _aiToString(aiCached && aiCached.ThinkingSkills, "التركيز والتحليل والملاحظة");
      var aiNote = _aiToString(aiCached && aiCached.TeacherNote, "متابعة أداء الطلاب وتقديم التغذية الراجعة.");

      if (aiCached) {
        console.log('[Moeen-2-AI] ✅ Normalized AI content for lesson', lessonId,
          '| vocab len:', aiVocab.length,
          '| prep len:', aiPrep.length);
      }

      if (aiCached) {
        console.log('[Moeen-2-AI] ✅ Using AI content for lesson', lessonId);
      } else {
        console.log('[Moeen-2-AI] ⚠️ No AI cache for', lessonId, '— using defaults');
      }

      // Strategies + teachingTools — replicate competitor's exact payload pattern.
      // FormData.append() with the same key multiple times produces the standard
      // "strategies=2&strategies=4&strategies=5..." form-encoding that ASP.NET MVC
      // binds to List<int> on the server side.
      // IDs are static Madrasati checkbox values (verified from competitor_full.json HAR).
      // We randomly select a subset of these IDs every time to ensure variety.
      function getRandomSubset(arr, min, max) {
        var shuffled = arr.slice().sort(function() { return 0.5 - Math.random(); });
        var count = Math.floor(Math.random() * (max - min + 1)) + min;
        return shuffled.slice(0, Math.min(count, arr.length));
      }

      var Moeen2_DEFAULT_STRATEGIES = [2, 4, 5, 12, 19];
      var Moeen2_DEFAULT_TEACHING_TOOLS = [1, 2, 3, 5, 7, 8, 9, 11]; // 7 added (verified from competitor HAR)

      var selectedStrategies = getRandomSubset(Moeen2_DEFAULT_STRATEGIES, 2, 4);
      var selectedTools = getRandomSubset(Moeen2_DEFAULT_TEACHING_TOOLS, 3, 5);

      selectedStrategies.forEach(function (id) {
        finalForm.append('strategies', String(id));
      });
      finalForm.append('strategyExtraData', 'الفهم القرائي'); // competitor sends this after strategies
      selectedTools.forEach(function (id) {
        finalForm.append('teachingTools', String(id));
      });
      console.log('[Moeen-2] ✅ Appended randomized', selectedStrategies.length, 'strategies + strategyExtraData +', selectedTools.length, 'teachingTools');

      finalForm.append('ThinkingSkills', aiThink);
      finalForm.append('LectureClassPreparationText', aiPrep);
      finalForm.append('LectureClassCloseText', aiClose);
      finalForm.append('LessonVocabulary', aiVocab);
      finalForm.append('TeacherNote', aiNote);

      // Resource windows must match the scheduled lecture time, especially for
      // multi-lesson prepare where MlutiLessonPlan provides MultiPrepareLesson[0].
      const rawLectureStart = finalForm.get('MultiPrepareLesson[0].StartDate')
        || finalForm.get('StartDate')
        || '';

      function parseMadrasatiDate(s) {
        if (!s || typeof s !== 'string') return null;
        const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (!m) return null;
        const [, mo, da, yr, hh, mm, ss] = m;
        const d = new Date(Number(yr), Number(mo) - 1, Number(da), Number(hh), Number(mm), Number(ss));
        return isNaN(d.getTime()) ? null : d;
      }

      function fmtProjectTime(d) {
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear();
        let hour = d.getHours();
        const min = String(d.getMinutes()).padStart(2, '0');
        const sec = String(d.getSeconds()).padStart(2, '0');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        return `${month}/${day}/${year} ${hour}:${min}:${sec} ${ampm}`;
      }

      function deleteFormDataPrefix(form, prefix) {
        Array.from(form.keys()).forEach(function (key) {
          if (String(key).indexOf(prefix) === 0) form.delete(key);
        });
      }

      function firstFormValueMatching(form, pattern) {
        for (const key of form.keys()) {
          pattern.lastIndex = 0;
          if (!pattern.test(String(key))) continue;
          pattern.lastIndex = 0;
          const value = String(form.get(key) || '').trim();
          if (value) return value;
        }
        return '';
      }

      let startDate = parseMadrasatiDate(rawLectureStart);
      if (!startDate) {
        console.warn('[Moeen-2] Resource lists: could not parse lecture StartDate; using now() as fallback. raw=', JSON.stringify(rawLectureStart));
        startDate = new Date();
      } else {
        console.log('[Moeen-2] Resource lists: using lecture StartDate from form:', rawLectureStart, '→ parsed:', startDate.toString());
      }

      const endDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      const startTimeStr = fmtProjectTime(startDate);
      const endTimeStr = fmtProjectTime(endDate);

      const formProjectId = firstFormValueMatching(finalForm, /^LectureProjectsList\[\d+\]\.ProjectId$/);
      const formAssignmentId = firstFormValueMatching(finalForm, /^LectureAssignmentsList\[\d+\]\.AssignmentId$/);
      const formExamId = firstFormValueMatching(finalForm, /^LectureExamsList\[\d+\]\.ExamId$/);
      // Gate resolved IDs on their resource toggle — form fallbacks (from MlutiLessonPlan
      // hidden inputs) are also gated so a previous-save's ID doesn't bleed through when
      // the teacher has disabled that resource type.
      const resolvedProjectId = _shouldRunActivity ? (activityProjectId || formProjectId) : null;
      const resolvedAssignmentId = _resHomework ? (homeworkAssignmentId || formAssignmentId) : null;
      const resolvedExamId = _resExam ? (examId || formExamId) : null;
      let homeworkAttachData = null;

      if (resolvedAssignmentId) {
        const attachResult = await silentAttachHomeworkToLecture({
          assignmentId: resolvedAssignmentId,
          subjectId: String(finalSubjectId).trim(),
          schoolId: String(finalForm.get('SchoolId') || '').trim(),
          timeTableId: String(finalForm.get('TimeTableId') || finalTimeTableId || '').trim(),
          startDateRaw: rawLectureStart,
          endDateRaw: finalForm.get('MultiPrepareLesson[0].EndDate') || finalForm.get('EndDate') || '',
          isMulti: false,
          dayCount: '3',
          assignmentType: '1',
          isGradeBook: true
        });
        if (attachResult.ok) {
          homeworkAttachData = attachResult.data || {};
          injectHomeworkIntoPageState(resolvedAssignmentId, homeworkAttachData, {
            grade: '1',
            assignmentName: 'واجب (' + lessonName + ')',
            assignmentType: '1',
            dayCount: '3',
            timeTableId: String(finalForm.get('TimeTableId') || finalTimeTableId || '').trim(),
            startDateTime: homeworkAttachData.startDateTime || startTimeStr,
            endDateTime: homeworkAttachData.endDateTime || endTimeStr
          });
        } else {
          console.warn('[Moeen-2] Homework AddAssignmentToLecture attach failed; SaveLastLessonPlan payload will still include AssignmentId:', resolvedAssignmentId, 'reason:', attachResult.message);
        }
      }

      // Enrichment is bound to the lecture inside the SaveLastLessonPlan multipart
      // payload itself via LectureClassLearningResources[0].* fields appended above.
      // No separate AddActivityToLecture call is needed.

      // Include the Activity so the server validation passes (requires at least one نشاط/واجب/إثراء).
      if (resolvedProjectId) {
        deleteFormDataPrefix(finalForm, 'LectureProjectsList[');
        finalForm.append('LectureProjectsList[0].ProjectId', resolvedProjectId);
        finalForm.append('LectureProjectsList[0].Grade', '1');
        finalForm.append('LectureProjectsList[0].StartTime', startTimeStr);
        finalForm.append('LectureProjectsList[0].EndTime', endTimeStr);
        finalForm.append('LectureProjectsList[0].Name', 'واجب');
        finalForm.append('LectureProjectsList[0].DayCount', '3');

        console.log('[Moeen-2] LectureProjectsList[0] →',
          'ProjectId:', resolvedProjectId,
          'StartTime:', startTimeStr,
          'EndTime:', endTimeStr);
      } else {
        console.warn('[Moeen-2] No projectId — SaveLastLessonPlan will rely on homework/exam if available.');
      }

      // ── LectureClassLearningResources (Enrichment binding) ───────────────────────
      // Verified from competitor HAR: enrichment is attached to the lecture by including
      // these four fields in the SaveLastLessonPlan payload itself, NOT via a separate
      // AddActivityToLecture call. ActivityId_Enc is the 32-hex GUID returned by the
      // MangeResources/Index DIFF after a successful enrichment POST.
      if (enrichmentActivityId) {
        deleteFormDataPrefix(finalForm, 'LectureClassLearningResources[');
        finalForm.append('LectureClassLearningResources[0].ActivityType', '1');
        finalForm.append('LectureClassLearningResources[0].ActivityPath', '');
        finalForm.append('LectureClassLearningResources[0].Name', String(lessonName || ''));
        finalForm.append('LectureClassLearningResources[0].ActivityId_Enc', String(enrichmentActivityId));

        console.log('[Moeen-2] LectureClassLearningResources[0] (Enrichment) →',
          'ActivityId_Enc:', enrichmentActivityId,
          'Name:', lessonName);
      }

      // ── LectureAssignmentsList (Homework) ─────────────────────────────────────────
      if (resolvedAssignmentId) {
        const assignmentStartTime = homeworkAttachData && homeworkAttachData.startDateTime ? String(homeworkAttachData.startDateTime) : startTimeStr;
        const assignmentEndTime = homeworkAttachData && homeworkAttachData.endDateTime ? String(homeworkAttachData.endDateTime) : endTimeStr;
        const assignmentGradeBook = homeworkAttachData && homeworkAttachData.isGradeBook != null ? String(homeworkAttachData.isGradeBook) : 'true';
        deleteFormDataPrefix(finalForm, 'LectureAssignmentsList[');
        finalForm.append('LectureAssignmentsList[0].AssignmentId', resolvedAssignmentId);
        finalForm.append('LectureAssignmentsList[0].Grade', '1');
        finalForm.append('LectureAssignmentsList[0].IsGradeBook', assignmentGradeBook);
        finalForm.append('LectureAssignmentsList[0].StartTime', assignmentStartTime);
        finalForm.append('LectureAssignmentsList[0].EndTime', assignmentEndTime);
        finalForm.append('LectureAssignmentsList[0].DayCount', '3');
        console.log('[Moeen-2] LectureAssignmentsList[0] → AssignmentId:', resolvedAssignmentId, 'StartTime:', assignmentStartTime, 'EndTime:', assignmentEndTime);
      } else {
        console.warn('[Moeen-2] No homeworkAssignmentId — LectureAssignmentsList omitted from SaveLastLessonPlan.');
      }

      // ── LectureExamsList (Exam) ───────────────────────────────────────────────
      if (resolvedExamId) {
        deleteFormDataPrefix(finalForm, 'LectureExamsList[');
        const examEndDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);
        const examEndStr = fmtProjectTime(examEndDate);
        finalForm.append('LectureExamsList[0].ExamId', resolvedExamId);
        finalForm.append('LectureExamsList[0].Duration', '20');
        finalForm.append('LectureExamsList[0].Grade', '5');
        finalForm.append('LectureExamsList[0].IsGradeBook', 'false');
        finalForm.append('LectureExamsList[0].Name', 'اختبار (' + lessonName + ')');
        finalForm.append('LectureExamsList[0].StartTime', startTimeStr);
        finalForm.append('LectureExamsList[0].EndTime', examEndStr);
        finalForm.append('LectureExamsList[0].DayCount', '5');
        console.log('[Moeen-2] LectureExamsList[0] → ExamId:', resolvedExamId);
      } else {
        console.warn('[Moeen-2] No examId — LectureExamsList omitted from SaveLastLessonPlan.');
      }

      console.log('[Moeen-2] Resource list final payload →',
        'ProjectId:', finalForm.get('LectureProjectsList[0].ProjectId') || '',
        'AssignmentId:', finalForm.get('LectureAssignmentsList[0].AssignmentId') || '',
        'ExamId:', finalForm.get('LectureExamsList[0].ExamId') || '');

      try {
        const saveRes = await fetch("https://schools.madrasati.sa/Teacher/Lessons/SaveLastLessonPlan", {
          method: "POST",
          credentials: "same-origin",
          body: finalForm
        });

        // 🚀 Detect ASP.NET validation redirects (Failure bounces back to ManageLecture or NotPermitted)
        if (saveRes.url && (saveRes.url.includes('ManageLecture') || saveRes.url.includes('NotPermitted') || saveRes.url.includes('Error'))) {
          console.error("[Moeen-2] Save rejected by server due to missing resource or slow DB sync. Redirected to:", saveRes.url);
          return false;
        }

        return saveRes.ok;
      } catch (e) {
        console.error("[Moeen-2] Failed to POST Final Lesson Save", e);
        return false;
      }
    }
    async function iframePrepareLesson(token, selection) {
      // Persist the selection so the auto flow inside the iframe can find it on STEP1
      var stored = await getLocal([DASHBOARD_SELECTIONS_KEY]);
      var sels = stored[DASHBOARD_SELECTIONS_KEY] || {};
      sels[token] = { mode: 'auto', treeValue: selection.treeValue };
      await setLocal({ [DASHBOARD_SELECTIONS_KEY]: sels });

      // Open the dashboard URL inside a hidden iframe; the boot hook will click the cell,
      // Madrasati will navigate the subframe to ManageLecture, then the hook starts AutomationController.
      var dashUrl = new URL(window.location.href);
      dashUrl.searchParams.set('Moeen-2_iframe', '1');
      dashUrl.searchParams.set('Moeen-2_click', token);

      var iframe = document.createElement('iframe');
      iframe.name = 'Moeen-2_iframe_blue_' + token;
      iframe.style.cssText = 'width:0;height:0;position:absolute;top:-10000px;left:-10000px;opacity:0;border:none;pointer-events:none;';
      document.body.appendChild(iframe);
      iframe.src = dashUrl.toString();

      const result = await new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 120000); // 2 min hard cap
        function onMessage(e) {
          if (e.data && e.data.type === 'Moeen-2_IFRAME_DONE') {
            clearTimeout(timeout);
            window.removeEventListener('message', onMessage);
            resolve(!!e.data.success);
          }
        }
        window.addEventListener('message', onMessage);
      });

      iframe.remove();
      return result;
    }

    function getAILessonIdFromCardItem(cardItem) {
      try {
        var treeValue = cardItem && cardItem.selection && cardItem.selection.treeValue;
        if (treeValue && typeof treeValue === 'string') {
          var parts = treeValue.split(',');
          if (parts.length >= 3) return String(parts[2]).trim();
        }
      } catch (err) {
        console.warn('[Moeen-2-AI] prefetch: error parsing treeValue:', err && err.message);
      }
      return '';
    }

    // ── Prefetch AI content for a single lesson card and cache in chrome.storage.local ──
    // Returns the AI object (5 fields) or null on failure. Cache key: Moeen-2_ai_<lessonId>.
    async function runAILessonPrefetch(cardItem, lessonId) {
      try {
        console.log('[Moeen-2-AI] prefetch: resolved lessonId', lessonId, 'from treeValue');
        var cacheKey = 'Moeen-2_ai_' + lessonId;

        // 1. Try cache first
        var cached = await new Promise(function (resolve) {
          chrome.storage.local.get([cacheKey], function (r) { resolve(r[cacheKey] || null); });
        });
        if (cached && cached.LectureClassPreparationText) {
          console.log('[Moeen-2-AI] ✅ cache hit for', lessonId);
          return cached;
        }

        // 2. Build context from the SAME canonical sources used elsewhere in the file:
        //    - lessonName: from selection.treeText (matches silentPrepareLesson line 1571)
        //    - subjectName: from <h2> inside card div (matches dashboard dropdown builder line 1218-1219)
        //    - gradeName: scraped from page (breadcrumb / sidebar / header). Best-effort; AI tolerates empty grade.
        var div = cardItem && cardItem.div ? cardItem.div : null;
        var lessonName = '';
        try {
          var tt = cardItem && cardItem.selection && cardItem.selection.treeText;
          if (tt && typeof tt === 'string') {
            lessonName = tt.trim().replace(/:$/, '').trim();
          }
        } catch (_) { }

        var subjectName = '';
        try {
          if (div) {
            var h2 = div.querySelector('h2');
            if (h2) subjectName = (h2.innerText || h2.textContent || '').trim();
          }
        } catch (_) { }

        var gradeName = '';
        // The grade is not in the dashboard card DOM and not in our local JSON.
        // We will resolve it later inside silentPrepareLesson by parsing the
        // ManageLecture HTML breadcrumb, then write it back to the AI cache.
        // For the prefetch context we send to n8n RIGHT NOW, we leave it empty —
        // the AI tolerates empty grade and still produces high-quality content
        // because it has subject + lesson_title.
        // (Future optimization: pre-fetch ManageLecture HTML in parallel before
        // the AI call so we can pass grade on the first attempt.)

        console.log('[Moeen-2-AI] prefetch context →',
          'grade:', JSON.stringify(gradeName),
          '| subject:', JSON.stringify(subjectName),
          '| lesson_title:', JSON.stringify(lessonName));

        if (!lessonName && !subjectName) {
          console.warn('[Moeen-2-AI] prefetch skipped — both lessonName and subjectName are empty for lessonId', lessonId);
          return null;
        }

        // 3. Call n8n
        var controller = new AbortController();
        var timeoutId = setTimeout(function () { controller.abort(); }, AI_WEBHOOK_TIMEOUT_MS);
        var res;
        try {
          res = await fetch(N8N_AI_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': N8N_AI_API_KEY
            },
            body: JSON.stringify({
              grade: gradeName,
              subject: subjectName,
              lesson_title: lessonName
            }),
            signal: controller.signal
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (!res.ok) {
          console.warn('[Moeen-2-AI] prefetch HTTP', res.status, 'for', lessonId);
          return null;
        }
        var data = normalizeAIWebhookResponse(await res.json());
        if (!data) {
          console.warn('[Moeen-2-AI] prefetch: invalid response shape for', lessonId);
          return null;
        }

        // 4. Cache and return
        await new Promise(function (resolve) {
          var payload = {};
          payload[cacheKey] = data;
          chrome.storage.local.set(payload, resolve);
        });
        console.log('[Moeen-2-AI] ✅ prefetched + cached', lessonId);
        return data;
      } catch (err) {
        console.warn('[Moeen-2-AI] prefetch error:', err && err.message);
        return null;
      }
    }

    async function runWithAIPrefetchSlot(task) {
      if (aiPrefetchActiveCount >= 3) {
        await new Promise(function (resolve) { aiPrefetchWaiters.push(resolve); });
      } else {
        aiPrefetchActiveCount++;
      }
      try {
        return await task();
      } finally {
        var wakeNext = aiPrefetchWaiters.shift();
        if (wakeNext) {
          // Transfer this occupied slot directly to the next waiter.
          wakeNext();
        } else {
          aiPrefetchActiveCount--;
        }
      }
    }

    async function prefetchAILessonDataForCard(cardItem) {
      var lessonId = getAILessonIdFromCardItem(cardItem);
      if (!lessonId) {
        console.warn('[Moeen-2-AI] prefetch skipped — could not parse lessonId from treeValue:', cardItem && cardItem.selection && cardItem.selection.treeValue);
        return null;
      }

      var runningRequest = aiPrefetchInFlight.get(lessonId);
      if (runningRequest) {
        console.log('[Moeen-2-AI] joining in-flight prefetch for', lessonId);
        return runningRequest;
      }

      var prefetchPromise = runWithAIPrefetchSlot(function () {
        return runAILessonPrefetch(cardItem, lessonId);
      });
      aiPrefetchInFlight.set(lessonId, prefetchPromise);
      try {
        return await prefetchPromise;
      } finally {
        if (aiPrefetchInFlight.get(lessonId) === prefetchPromise) {
          aiPrefetchInFlight.delete(lessonId);
        }
      }
    }

    function scheduleWithConcurrency(items, limit, worker) {
      var nextIndex = 0;
      var workerCount = Math.min(Math.max(1, limit), items.length);
      var taskSlots = items.map(function () {
        var resolveTask;
        var promise = new Promise(function (resolve) { resolveTask = resolve; });
        return { promise: promise, resolve: resolveTask };
      });

      async function runWorker() {
        while (true) {
          var index = nextIndex++;
          if (index >= items.length) return;
          var result = null;
          try {
            result = await worker(items[index], index);
          } catch (err) {
            console.warn('[Moeen-2] background preparation failed:', err && err.message);
          }
          taskSlots[index].resolve(result);
        }
      }

      for (var i = 0; i < workerCount; i++) void runWorker();
      return taskSlots.map(function (slot) { return slot.promise; });
    }

    function getBackendSelectedModules() {
      var activity = getResourceEnabled('activity');
      var homework = getResourceEnabled('homework');
      var exam = getResourceEnabled('exam');
      var enrichment = getResourceEnabled('enrichment');
      var modules = [];
      if (activity || (!homework && !exam && !enrichment)) modules.push('assignment');
      if (homework) modules.push('homework');
      if (exam) modules.push('exam');
      if (enrichment) modules.push('enrichment');
      return modules;
    }

    function buildBackendPreparationPayload(item) {
      var ids = String(item.selection && item.selection.treeValue || '').split(',');
      if (ids.length < 3) throw new Error('تعذر قراءة معرف الدرس المختار.');

      var cell = item.div.closest('td') || item.div.parentElement;
      var anchor = cell ? cell.querySelector('a[href*="ManageLecture"]') : null;
      var manageUrl = anchor && anchor.href ? anchor.href : '';
      var classroomId = item.div.getAttribute('data-class-id')
        || item.div.getAttribute('data-classroom-id')
        || '';
      var timeTableId = item.div.getAttribute('data-timetable-id')
        || item.div.getAttribute('data-time-table-id')
        || '';

      if (manageUrl) {
        var parsed = new URL(manageUrl, window.location.origin);
        classroomId = parsed.searchParams.get('classroomId') || classroomId;
        timeTableId = parsed.searchParams.get('TimeTableId') || timeTableId;
      } else if (item.realSchoolId && classroomId && item.token) {
        var generatedUrl = new URL('/SchoolSchedule/Schedule/ManageLecture', window.location.origin);
        generatedUrl.searchParams.set('SchoolId', item.realSchoolId);
        generatedUrl.searchParams.set('lectureId', item.token);
        generatedUrl.searchParams.set('subjectId', item.subjectId || ids[0]);
        generatedUrl.searchParams.set('classroomId', classroomId);
        manageUrl = generatedUrl.toString();
      }

      // Green cards expose an encrypted data-data token. MlutiLessonPlan uses
      // it to recover the canonical numeric SchoolId and TimeTableId.
      var encryptedToken = String(item.token || '').length >= 16 ? String(item.token) : null;
      // data-lecture-id and the ManageLecture lectureId query parameter are
      // schedule slot numbers (for example "7"), not TimeTableId values. The
      // encrypted data-data token is the canonical input for both card types.
      timeTableId = encryptedToken || timeTableId;
      if (!classroomId || !timeTableId) {
        throw new Error('بيانات الفصل أو الحصة ناقصة. أعد تحميل جدول مدرستي ثم حاول مجدداً.');
      }

      return {
        subject_id: Number(ids[0]),
        chapter_id: Number(ids[1]),
        lesson_madrasati_id: String(ids[2]),
        lesson_title: String(item.selection.treeText || '').trim().replace(/:$/, '').trim(),
        classroom_id: String(classroomId),
        school_madrasati_id: String(item.realSchoolId || ''),
        time_table_id: String(timeTableId).slice(0, 255),
        encrypted_token: encryptedToken,
        manage_lecture_url: manageUrl || null,
        selected_modules: getBackendSelectedModules()
      };
    }

    function getBackendResponseMessage(result, fallback) {
      var responseData = result && result.data;
      var validationErrors = responseData && responseData.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        var firstField = Object.keys(validationErrors)[0];
        var firstMessages = firstField && validationErrors[firstField];
        var firstMessage = Array.isArray(firstMessages) ? firstMessages[0] : firstMessages;
        if (firstMessage) return 'خطأ في ' + firstField + ': ' + firstMessage;
      }
      return responseData && (responseData.message || responseData.error)
        || result && result.error
        || fallback;
    }

    function createBackendPreparationError(result, fallback) {
      var error = new Error(getBackendResponseMessage(result, fallback));
      error.backendStatus = Number(result && result.status || 0);
      error.backendCode = result && result.data && result.data.code || null;
      error.isBackendPreparationError = true;
      return error;
    }

    function readBackendPreparationStatus(result) {
      var responseData = result && result.data;
      var preparationData = responseData && (responseData.preparation || responseData.data) || responseData;
      var rawStatus = preparationData && (preparationData.status || preparationData.state) || '';
      var normalized = String(rawStatus).trim().toLowerCase().replace(/[\s-]+/g, '_');

      if (['done', 'completed', 'complete', 'succeeded', 'success'].includes(normalized)) {
        return { terminal: true, succeeded: true, status: normalized, data: preparationData };
      }
      if (['failed', 'failure', 'error', 'cancelled', 'canceled'].includes(normalized)) {
        return { terminal: true, succeeded: false, status: normalized, data: preparationData };
      }
      if (['pending', 'queued', 'processing', 'running', 'in_progress', 'started', 'retrying'].includes(normalized)) {
        return { terminal: false, succeeded: false, status: normalized, data: preparationData };
      }
      return { terminal: false, succeeded: false, status: normalized, data: preparationData, invalid: true };
    }

    function getBackendStatusTrackingError(result, state, preparationId) {
      if (!result || !result.ok || !result.data) {
        return getBackendResponseMessage(result, 'تعذر قراءة حالة الحصة رقم ' + preparationId + ' من الخادم.');
      }
      if (state && state.invalid) {
        return state.status
          ? 'أعاد الخادم حالة غير معروفة (' + state.status + ') للحصة رقم ' + preparationId + '.'
          : 'لم يُرجع الخادم حالة للحصة رقم ' + preparationId + '.';
      }
      return '';
    }

    function isBackendPolicyFailure(error) {
      var code = error && error.backendCode;
      return error && (
        error.backendStatus === 401
        || error.backendStatus === 402
        || code === 'unauthenticated'
        || code === 'auth_required'
        || code === 'account_suspended'
        || code === 'no_teacher_account'
        || code === 'subscription_required'
        || code === 'subscription_expired'
        || code === 'trial_expired'
        || code === 'quota_exceeded'
        || code === 'batch_quota_exceeded'
        || code === 'quota_reserved'
      );
    }

    async function runBackendPreparationBatch(tokensToPrepare) {
      var authData = await getLocal([AUTH_SESSION_KEY]);
      var authSession = authData[AUTH_SESSION_KEY];
      if (!authSession || !authSession.token) {
        throw new Error('سجّل الدخول إلى حضر من أيقونة الإضافة أولاً.');
      }

      var schoolIds = Array.from(new Set(tokensToPrepare.map(function (item) {
        return String(item.realSchoolId || '').toUpperCase();
      }).filter(Boolean)));
      if (schoolIds.length !== 1) {
        throw new Error('يجب تحضير حصص مدرسة واحدة في كل دفعة. افتح جدول المدرسة المطلوبة ثم أعد المحاولة.');
      }

      updateDashboardStatus('🔐 جاري تأمين جلسة مدرستي مع الخادم...', 'loading');
      var syncResult = await sendRuntimeMessage({
        action: 'SYNC_MADRASATI_SESSION_TO_BACKEND',
        token: authSession.token,
        tokenType: authSession.tokenType || 'Bearer',
        schoolId: schoolIds[0],
        csrfToken: getCsrfToken(),
        madrasatiOrigin: window.location.origin,
        madrasatiUrl: window.location.href
      });
      if (!syncResult || !syncResult.ok) {
        console.warn('[Hadar] Backend session sync was rejected.', {
          status: syncResult && syncResult.status,
          code: syncResult && syncResult.data && syncResult.data.code,
          cookieNames: syncResult && syncResult.data && syncResult.data.details
            && syncResult.data.details.cookies_received || [],
          validationErrors: syncResult && syncResult.data && syncResult.data.errors || null
        });
        throw createBackendPreparationError(syncResult, 'تعذر ربط جلسة مدرستي بالخادم.');
      }

      var lessons = tokensToPrepare.map(buildBackendPreparationPayload);
      updateDashboardStatus('☁️ تم إرسال ' + lessons.length + ' حصة للتحضير في الخلفية...', 'loading');
      var existingBatchData = await getLocal([BACKEND_PREPARATION_BATCH_KEY]);
      var existingBatch = existingBatchData[BACKEND_PREPARATION_BATCH_KEY];
      var clientRequestId = existingBatch && !existingBatch.preparationIds?.length
        && Date.now() - Number(existingBatch.createdAt || 0) < 10 * 60 * 1000
        ? existingBatch.clientRequestId
        : null;
      if (!clientRequestId) {
        clientRequestId = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
          ? globalThis.crypto.randomUUID()
          : 'batch-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      }
      await setLocal({
        [BACKEND_PREPARATION_BATCH_KEY]: {
          clientRequestId: clientRequestId,
          preparationIds: [],
          createdAt: Date.now()
        }
      });
      var startResult = await sendRuntimeMessage({
        action: 'START_BACKEND_PREPARATION',
        token: authSession.token,
        tokenType: authSession.tokenType || 'Bearer',
        payload: { client_request_id: clientRequestId, lessons: lessons }
      });
      if (!startResult || !startResult.ok) {
        throw createBackendPreparationError(startResult, 'تعذر بدء التحضير على الخادم.');
      }

      var preparationIds = startResult.data && startResult.data.preparation_ids || [];
      if (!preparationIds.length) throw new Error('لم يُرجع الخادم أرقام عمليات التحضير.');
      await setLocal({
        [BACKEND_PREPARATION_BATCH_KEY]: {
          clientRequestId: clientRequestId,
          preparationIds: preparationIds,
          createdAt: Date.now()
        }
      });

      backendBatchPolling = true;
      var pending = new Set(preparationIds.map(String));
      var succeeded = 0;
      var failures = [];
      var trackingFailures = new Map();
      var deadline = Date.now() + 30 * 60 * 1000;
      try {
        while (pending.size > 0 && Date.now() < deadline) {
          var idsThisRound = Array.from(pending);
          var statuses = await Promise.all(idsThisRound.map(function (id) {
            return sendRuntimeMessage({
              action: 'GET_BACKEND_PREPARATION_STATUS',
              token: authSession.token,
              tokenType: authSession.tokenType || 'Bearer',
              preparationId: id
            });
          }));
          var trackingError = '';

          statuses.forEach(function (result, index) {
            var id = idsThisRound[index];
            var state = readBackendPreparationStatus(result);
            var statusError = getBackendStatusTrackingError(result, state, id);
            if (statusError) {
              var failureCount = Number(trackingFailures.get(id) || 0) + 1;
              trackingFailures.set(id, failureCount);
              console.warn('[Hadar] Backend preparation status check failed.', {
                preparationId: id,
                attempt: failureCount,
                httpStatus: result && result.status || 0,
                backendStatus: state.status || null,
                message: statusError
              });
              if (failureCount >= 5) trackingError = statusError;
              return;
            }

            trackingFailures.delete(id);
            if (!state.terminal) return;
            pending.delete(id);
            if (state.succeeded) {
              succeeded++;
            } else {
              failures.push(
                state.data && (state.data.error || state.data.message)
                || ('فشلت الحصة رقم ' + id)
              );
            }
          });

          if (trackingError) {
            updateDashboardStatus('⚠️ تعذر متابعة حالة التحضير: ' + trackingError + ' قد يستمر التحضير على الخادم.', 'warning');
            return {
              succeeded: succeeded,
              failed: failures.length,
              pending: pending.size,
              trackingError: trackingError,
              errors: failures
            };
          }

          updateDashboardStatus(
            '☁️ التحضير مستمر على الخادم — اكتمل ' + (succeeded + failures.length) + ' من ' + preparationIds.length,
            failures.length ? 'warning' : 'loading'
          );
          if (pending.size > 0) await new Promise(function (resolve) { setTimeout(resolve, 3000); });
        }

        if (pending.size > 0) {
          updateDashboardStatus('☁️ التحضير ما زال مستمراً على الخادم ويمكنك إغلاق الصفحة بأمان.', 'loading');
          return { succeeded: succeeded, failed: failures.length, pending: pending.size, errors: failures };
        }

        await removeLocal([BACKEND_PREPARATION_BATCH_KEY]);
        return { succeeded: succeeded, failed: failures.length, pending: 0, errors: failures };
      } finally {
        backendBatchPolling = false;
      }
    }

    async function resumeBackendPreparationBatchIfNeeded() {
      if (!BACKEND_PREPARATION_ENABLED || backendBatchPolling) return;
      var stored = await getLocal([BACKEND_PREPARATION_BATCH_KEY, AUTH_SESSION_KEY]);
      var batch = stored[BACKEND_PREPARATION_BATCH_KEY];
      var authSession = stored[AUTH_SESSION_KEY];
      var preparationIds = batch && Array.isArray(batch.preparationIds) ? batch.preparationIds : [];
      if (!preparationIds.length || !authSession || !authSession.token) return;

      backendBatchPolling = true;
      try {
        updateDashboardStatus('☁️ استئناف متابعة التحضير الجاري على الخادم...', 'loading');
        var pending = new Set(preparationIds.map(String));
        var succeeded = 0;
        var failed = 0;
        var trackingFailures = new Map();
        var deadline = Date.now() + 30 * 60 * 1000;

        while (pending.size && Date.now() < deadline) {
          var ids = Array.from(pending);
          var results = await Promise.all(ids.map(function (id) {
            return sendRuntimeMessage({
              action: 'GET_BACKEND_PREPARATION_STATUS',
              token: authSession.token,
              tokenType: authSession.tokenType || 'Bearer',
              preparationId: id
            });
          }));
          var trackingError = '';
          results.forEach(function (result, index) {
            var id = ids[index];
            var state = readBackendPreparationStatus(result);
            var statusError = getBackendStatusTrackingError(result, state, id);
            if (statusError) {
              var failureCount = Number(trackingFailures.get(id) || 0) + 1;
              trackingFailures.set(id, failureCount);
              if (failureCount >= 5) trackingError = statusError;
              return;
            }
            trackingFailures.delete(id);
            if (!state.terminal) return;
            pending.delete(id);
            if (state.succeeded) succeeded++;
            else failed++;
          });

          if (trackingError) {
            updateDashboardStatus('⚠️ تعذر متابعة حالة التحضير: ' + trackingError + ' قد يستمر التحضير على الخادم.', 'warning');
            return;
          }

          updateDashboardStatus(
            '☁️ التحضير على الخادم — اكتمل ' + (succeeded + failed) + ' من ' + preparationIds.length,
            failed ? 'warning' : 'loading'
          );
          if (pending.size) await new Promise(function (resolve) { setTimeout(resolve, 3000); });
        }

        if (!pending.size) {
          await removeLocal([BACKEND_PREPARATION_BATCH_KEY]);
          if (failed === 0) {
            updateDashboardStatus('✅ اكتمل تحضير ' + succeeded + ' حصة على الخادم.', 'success');
          } else {
            updateDashboardStatus('⚠️ اكتملت الدفعة: نجح ' + succeeded + ' وفشل ' + failed + '.', 'warning');
          }
        }
      } finally {
        backendBatchPolling = false;
      }
    }

    async function handleDashboardSave() {
      updateDashboardStatus("جاري التحقق من الاشتراك...", "loading");
      var accessResult = await checkCurrentSubscriptionAccess();
      if (!accessResult.ok) {
        showSubscriptionAccessException(accessResult);
        updateDashboardStatus("❌ " + getSubscriptionExceptionCopy(accessResult).message, "error");
        return;
      }

      var allSelects = document.querySelectorAll('.Moeen-2-dashboard-select');
      var tokensToPrepare = [];
      var successCount = 0;
      var queuedTokens = new Set();

      for (var select of allSelects) {
        if (!select.value || select.value === 'AI_AUTO') continue;

        var div = select.closest('div[data-data]') || select.parentElement;
        var lessonToken = select.getAttribute('data-lesson-token');
        if (!lessonToken || queuedTokens.has(lessonToken)) continue;
        queuedTokens.add(lessonToken);

        var cell = div.closest('td') || div.parentElement;

        // 1. Extract subjectId
        var subjectId = div.getAttribute('data-subject-id');
        if (!subjectId && cell) {
          var anchor = cell.querySelector('a');
          if (anchor && anchor.href) {
            var match = anchor.href.match(/subjectId=(\d+)/i);
            if (match) subjectId = match[1];
          }
        }

        // 2. Extract realSchoolId — instrumented to log which branch matched.
        var realSchoolId = null;
        var schoolIdSource = "none";
        if (cell) {
          var anchors = cell.querySelectorAll('a');
          for (var i = 0; i < anchors.length; i++) {
            var hrefMatch = anchors[i].href.match(/schoolId=([a-f0-9]{32})/i);
            if (hrefMatch) { realSchoolId = hrefMatch[1]; schoolIdSource = "cell-anchor-href"; break; }
            var onclickMatch = (anchors[i].getAttribute('onclick') || "").match(/'([a-f0-9]{32})'/i);
            if (onclickMatch) { realSchoolId = onclickMatch[1]; schoolIdSource = "cell-anchor-onclick"; break; }
          }
        }
        if (!realSchoolId) {
          var divOnclick = div.getAttribute('onclick') || "";
          var divMatch = divOnclick.match(/'([a-f0-9]{32})'/i);
          if (divMatch) { realSchoolId = divMatch[1]; schoolIdSource = "card-div-onclick"; }
        }
        if (!realSchoolId) {
          var urlParams = new URLSearchParams(window.location.search);
          realSchoolId = urlParams.get("SchoolId") || urlParams.get("schoolId") || (typeof getSchoolIdValue === 'function' ? getSchoolIdValue() : '79427');
          schoolIdSource = "url-bar-fallback";
        }
        console.log("[Moeen-2-DIAG] handleDashboardSave card →",
          "subjectId:", subjectId,
          "| realSchoolId:", realSchoolId,
          "| source:", schoolIdSource,
          "| cardDiv:", div);

        var selection = { treeValue: select.value, treeText: select.options[select.selectedIndex].text };
        tokensToPrepare.push({ select, div: div, token: lessonToken, selection, subjectId, realSchoolId });

        select.style.borderColor = '#c87f0a';
        select.style.background = 'rgba(200,127,10,0.08)';
      }

      if (tokensToPrepare.length === 0) return;

      updateDashboardStatus("⏳ جاري تحضير " + tokensToPrepare.length + " حصة — قد يستغرق هذا بضع دقائق...", "loading");

      // 3. Execute saves sequentially: ALL cards (Blue & Green) go through the headless API path.
      // silentPrepareLesson contains a fallback URL builder for Blue cards (data-subject-id +
      // data-class-id + lesson token), so the iframe legacy path is no longer needed.
      if (typeof silentPrepareLesson !== 'function') {
        updateDashboardStatus("❌ خطأ داخلي — يرجى إعادة تحميل الصفحة وإعادة المحاولة", "error");
        return;
      }

      var usingBrowserFallback = false;
      if (BACKEND_PREPARATION_ENABLED) {
        try {
          var backendResult = await runBackendPreparationBatch(tokensToPrepare);
          if (backendResult.pending > 0) return;
          if (backendResult.failed === 0) {
            updateDashboardStatus('✅ تم تحضير ' + backendResult.succeeded + ' حصة من الخادم بنجاح! جاري تحديث الجدول...', 'success');
            setTimeout(function () { window.location.reload(); }, 2000);
          } else {
            updateDashboardStatus('⚠️ تم تحضير ' + backendResult.succeeded + ' حصة، وفشلت ' + backendResult.failed + '. راجع سجل التحضير.', 'warning');
          }
          return;
        } catch (error) {
          if (isBackendPolicyFailure(error)) {
            console.warn('[حضر] Backend preparation blocked by account policy:', error);
            updateDashboardStatus('❌ ' + (error && error.message || 'التحضير غير متاح للحساب.'), 'error');
            return;
          }

          // Cloud preparation is an optimization, not a dependency. If its
          // session bridge, proxy, validation, or server is unavailable, keep
          // the extension useful by executing the existing browser workflow.
          console.warn('[حضر] Cloud preparation unavailable; switching to browser preparation.', {
            status: error && error.backendStatus || 0,
            code: error && error.backendCode || null,
            message: error && error.message || String(error)
          });
          usingBrowserFallback = true;
          updateDashboardStatus('⚠️ الخدمة السحابية غير متاحة حالياً — سيتم التحضير مباشرة داخل مدرستي...', 'warning');
        }
      }

      // Generate up to three lessons at once. Madrasati writes remain ordered
      // below because their before/after ProjectId snapshots must never overlap.
      // This is a pipeline: saving lesson 1 starts as soon as its AI data is
      // ready while lessons 2+ continue generating in the background.
      updateDashboardStatus(
        usingBrowserFallback
          ? "🖥️ جاري التحضير داخل المتصفح لأن الخدمة السحابية غير متاحة..."
          : "⚡ جاري تجهيز المحتوى بالتوازي قبل الحفظ...",
        usingBrowserFallback ? "warning" : "loading"
      );
      var aiPrefetchPromises = scheduleWithConcurrency(
        tokensToPrepare,
        3,
        function (item) { return prefetchAILessonDataForCard(item); }
      );

      var _saveIdx = 0;
      for (var item of tokensToPrepare) {
        _saveIdx++;
        updateDashboardStatus(
          "⏳ جاري تحضير حصة " + _saveIdx + " من " + tokensToPrepare.length + "...",
          "loading"
        );
        try {
          // Join the already-running background task for this lesson. Usually
          // this resolves immediately because selection-time prefetch cached it.
          await aiPrefetchPromises[_saveIdx - 1];

          var success = await silentPrepareLesson(item.token, item.selection, item.subjectId, item.realSchoolId, item.div);

          if (success) {
            item.select.style.borderColor = '#1a9448';
            item.select.style.background = 'rgba(26,148,72,0.04)';
            successCount++;
          } else {
            item.select.style.borderColor = '#c0392b';
            item.select.style.background = 'rgba(192,57,43,0.08)';
          }
        } catch (err) {
          console.error("[Moeen-2] prep failed for", item.token, err);
          item.select.style.borderColor = '#c0392b';
          item.select.style.background = 'rgba(192,57,43,0.08)';
        }
      }

      var _total = tokensToPrepare.length;
      if (successCount === _total) {
        updateDashboardStatus("✅ تم حفظ " + successCount + " حصة بنجاح! جاري إعادة تحميل الجدول...", "success");
        setTimeout(() => window.location.reload(), 2000);
      } else if (successCount > 0) {
        updateDashboardStatus("⚠️ تم حفظ " + successCount + " من " + _total + " حصة — بعض الحصص لم تكتمل، راجعها يدوياً", "warning");
      } else {
        updateDashboardStatus("❌ تعذّر تحضير الحصص — تحقق من اتصالك وحاول مجدداً", "error");
      }
    }
    // src/content/dashboard-storage-helpers.js
    async function getDashboardSelectionForCurrentLesson() {
      try {
        var stored = await getLocal([DASHBOARD_SELECTIONS_KEY]);
        var selections = stored[DASHBOARD_SELECTIONS_KEY];
        if (!selections || !Object.keys(selections).length) return null;

        // Try to match by lessonId from the current URL
        var urlParams = new URLSearchParams(window.location.search);
        var currentLessonId = urlParams.get("id") || urlParams.get("lessonId") || urlParams.get("lectureId") || "";

        // Also try extracting from hidden fields
        if (!currentLessonId) {
          currentLessonId = getFieldValue("#LessonId") || getFieldValue("#LectureId") || getFieldValue('input[name="Id"]') || "";
        }

        // Also try extracting from path
        if (!currentLessonId) {
          var pathMatch = window.location.pathname.match(/\/Index\/([\w\-]+)/);
          if (pathMatch) currentLessonId = pathMatch[1];
        }

        if (currentLessonId && selections[currentLessonId]) {
          return { lessonId: currentLessonId, path: selections[currentLessonId] };
        }

        // If no specific match, return the first selection (FIFO)
        var firstKey = Object.keys(selections)[0];
        if (firstKey) {
          return { lessonId: firstKey, path: selections[firstKey] };
        }

        return null;
      } catch (err) {
        log("getDashboardSelectionForCurrentLesson error:", err);
        return null;
      }
    }

    async function applyDashboardSelections(dashboardPath) {
      var path = dashboardPath.path;
      if (!path || !path.treeValue) return false;

      log("Dashboard: applying stored selection, mode=" + path.mode + " value=" + path.treeValue);

      var firstSelect = document.getElementById("SelectedUnitId");

      if (path.treeValue === 'AI_AUTO') {
        log("Dashboard: ignoring legacy automatic lesson selection");
        return false;
      }

      // Unit mode: select the specific unit chosen by the user
      if (isTrulyVisible(firstSelect)) {
        var unitFound = false;
        for (var opt of firstSelect.options) {
          if (opt.value === path.treeValue) {
            firstSelect.value = opt.value;
            triggerEvents(firstSelect, ["input", "change", "blur"]);
            if (typeof firstSelect.onchange === "function") {
              try { firstSelect.onchange(); } catch (e) { }
            }
            unitFound = true;
            log("Dashboard: selected unit '" + opt.textContent.trim() + "'");
            break;
          }
        }
        if (!unitFound) {
          log("Dashboard: unit value not found, falling back to last option");
          await selectLastOption(firstSelect);
        }
      }

      // Cascade through tree levels with selectLastOption (both modes)
      for (var index = 2; index <= 6; index++) {
        var select = await waitForOptions("SelectedTrees_" + index, 7000);
        if (select && isTrulyVisible(select)) {
          await selectLastOption(select);
        }
      }

      return true;
    }

    async function clearDashboardSelection(lessonId) {
      try {
        var stored = await getLocal([DASHBOARD_SELECTIONS_KEY]);
        var selections = stored[DASHBOARD_SELECTIONS_KEY];
        if (!selections) return;
        delete selections[lessonId];
        await setLocal({ [DASHBOARD_SELECTIONS_KEY]: selections });
        log("Dashboard: cleared selection for", lessonId);
      } catch (err) {
        log("Dashboard: clearDashboardSelection error:", err);
      }
    }

    // src/content/resource-fallbacks.js
    var hasInjectedFallbackResource = false;
    function isSecondPageVisible() {
      return isTrulyVisible(document.getElementById("secondPage"));
    }
    function isMainLessonPageVisible() {
      const mainPage = document.getElementById("mainPage");
      if (isTrulyVisible(mainPage)) return true;
      return detectPageState() === FLOW_STATES.STEP2;
    }
    function getRootScope(root) {
      if (!root) return null;
      if (root.body && typeof root.querySelector === "function") return root.body;
      return root;
    }
    function getRootDocument(root) {
      if (!root) return document;
      if (root.body && typeof root.querySelector === "function") return root;
      return root.ownerDocument || document;
    }
    function getIframeDocument(iframe) {
      if (!iframe || !isTrulyVisible(iframe)) return null;
      try {
        const iframeDocument = iframe.contentDocument;
        if (!iframeDocument || !iframeDocument.body) return null;
        if (iframeDocument.readyState === "loading") return null;
        return iframeDocument;
      } catch {
        return null;
      }
    }
    function getEnrichmentCreationRoot() {
      const iframeDocuments = Array.from(document.querySelectorAll("iframe")).map((iframe) => getIframeDocument(iframe)).filter(Boolean);
      const candidates = [
        document.getElementById("CreateResourceForm"),
        document.getElementById("LectuerToolsModalBody"),
        document.getElementById("LectuerToolsModal"),
        ...iframeDocuments,
        ...Array.from(document.querySelectorAll('.modal.show, .modal.in, [role="dialog"]'))
      ];
      for (const candidate of candidates) {
        const scope = getRootScope(candidate);
        if (!scope) continue;
        const isDocumentRoot = Boolean(candidate.body && typeof candidate.querySelector === "function");
        if (!isDocumentRoot && !isTrulyVisible(scope)) continue;
        if (scope.querySelector('#LessonsGoalsList, #txtName, #Name, #txtHelpText, #Description, #txtFullPath, input[type="url"]')) {
          return scope;
        }
      }
      return null;
    }
    async function returnToMainLessonPage() {
      if (isMainLessonPageVisible() && !isSecondPageVisible()) return true;
      const secondPage = document.getElementById("secondPage") || document;
      const backButton = findPreferredElement({
        root: secondPage,
        ids: ["backButton"],
        attributes: [`button[onclick*="showhidedivs('secondPage', 'mainPage')"]`],
        texts: ["\u0639\u0648\u062F\u0629"]
      });
      if (backButton) {
        activateElementOnce(backButton);
      }
      const returned = await waitForValue(
        () => isMainLessonPageVisible() && !isSecondPageVisible() ? true : null,
        8e3
      );
      return Boolean(returned);
    }
    function countVisibleChildren(element) {
      if (!element) return 0;
      return Array.from(element.children || []).filter(isTrulyVisible).length;
    }
    function countLegacySectionItems(sectionTitle) {
      const titles = getVisibleElements(".titlesection2, .titleSection2, h2, h3, h4, div, span");
      const matchingTitle = titles.find((element) => {
        const text = getElementLabel(element).replace(/\s+/g, " ").trim();
        return text === sectionTitle || text.includes(sectionTitle);
      });
      if (!matchingTitle) return 0;
      const level2 = matchingTitle.parentElement ? matchingTitle.parentElement.parentElement : null;
      if (!level2) return 0;
      const rows = Array.from(level2.querySelectorAll(".row"));
      if (rows[1]) {
        return countVisibleChildren(rows[1]);
      }
      return 0;
    }
    function getLessonResourceCounts() {
      const enrichments = countVisibleChildren(document.getElementById("ActivitiesDiv")) || countLegacySectionItems("\u0625\u062B\u0631\u0627\u0621\u0627\u062A");
      const assignments = countVisibleChildren(document.getElementById("AssignmentsDiv")) || countLegacySectionItems("\u0648\u0627\u062C\u0628\u0627\u062A");
      const exams = countVisibleChildren(document.getElementById("ExamsDiv")) || countLegacySectionItems("\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A");
      const projects = countVisibleChildren(document.getElementById("ProjectsDiv")) || countLegacySectionItems("\u0623\u0646\u0634\u0637\u0629 \u0645\u062F\u0631\u0633\u064A\u0629") || countLegacySectionItems("\u0623\u0646\u0634\u0637\u0629");
      return {
        enrichments,
        assignments,
        exams,
        projects,
        hasAny: hasInjectedFallbackResource || Boolean(enrichments || assignments || exams || projects)
      };
    }
    function getCurrentLessonName() {
      const select4 = document.getElementById("SelectedTrees_4");
      if (select4 && select4.value && select4.selectedOptions && select4.selectedOptions[0]) {
        return select4.selectedOptions[0].text.trim();
      }
      const select3 = document.getElementById("SelectedTrees_3");
      if (select3 && select3.value && select3.selectedOptions && select3.selectedOptions[0]) {
        return select3.selectedOptions[0].text.trim();
      }
      return "\u0627\u0644\u062F\u0631\u0633";
    }
    function scrapeLessonContext() {
      // Hardened scraper: all DOM reads are wrapped in try/catch so a DOM shift
      // (e.g. showing a Teams-link field after selecting 'افتراضي متزامن') never
      // throws before the fetch call is reached.

      var lessonTitle = "\u0627\u0644\u062F\u0631\u0633";
      try {
        // 1. Scrape lesson title from the last active SelectedTrees dropdown.
        //    Strip any trailing colon.
        for (var i = 6; i >= 2; i--) {
          var sel = document.getElementById("SelectedTrees_" + i);
          if (sel && sel.value && sel.selectedOptions && sel.selectedOptions[0]) {
            lessonTitle = (sel.selectedOptions[0].text || "").trim().replace(':', '').trim();
            break;
          }
        }
      } catch (e) {
        console.error('[\u062A\u062D\u0636\u064A\u0631\u064A] scrapeLessonContext: lessonTitle error', e);
      }

      var fullPathString = "";
      try {
        // 2. Find the breadcrumb text at the top of the page.
        //    Try common breadcrumb selectors used on Madrasati.
        var breadcrumbSelectors = [
          ".breadcrumb-item.active",
          ".breadcrumb li:last-child",
          ".breadcrumb",
          ".page-breadcrumb",
          ".header-breadcrumb",
          "[class*='breadcrumb']"
        ];
        for (var s of breadcrumbSelectors) {
          try {
            var bcEl = document.querySelector(s);
            if (bcEl) {
              var bcText = ((bcEl.innerText || bcEl.textContent) || "").trim();
              if (bcText && bcText.includes("-")) {
                fullPathString = bcText;
                break;
              }
            }
          } catch (_) { }
        }
      } catch (e) {
        console.error('[\u062A\u062D\u0636\u064A\u0631\u064A] scrapeLessonContext: breadcrumb error', e);
      }

      try {
        // 3. Fallback to the #SelectedUnitId selected option text if no breadcrumb found.
        if (!fullPathString) {
          var unitSelect = document.getElementById("SelectedUnitId");
          if (unitSelect && unitSelect.selectedOptions && unitSelect.selectedOptions[0]) {
            fullPathString = (unitSelect.selectedOptions[0].text || "").trim();
          }
        }
      } catch (e) {
        console.error('[\u062A\u062D\u0636\u064A\u0631\u064A] scrapeLessonContext: unitSelect fallback error', e);
      }

      // 4. Parse the full path string to extract Grade and Subject.
      var extractedGrade = "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F";
      var extractedSubject = fullPathString || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F";
      try {
        if (fullPathString && fullPathString.includes("-")) {
          var parts = fullPathString.split("-").map(function (part) { return part.trim(); });
          extractedSubject = parts[parts.length - 1];
          extractedGrade = parts.length > 1 ? parts[1] : parts[0];
        }
      } catch (e) {
        console.error('[\u062A\u062D\u0636\u064A\u0631\u064A] scrapeLessonContext: path parse error', e);
      }

      // جمع الـ checkboxes المتاحة من الصفحة
      var availableStrategies = [];
      var availableTools = [];

      document.querySelectorAll('input[name="strategies"]').forEach(function (cb) {
        var label = cb.closest('label') || document.querySelector('label[for="' + cb.id + '"]');
        var text = label ? label.textContent.trim() : '';
        if (text) availableStrategies.push(text);
      });

      document.querySelectorAll('input[name="teachingTools"]').forEach(function (cb) {
        var label = cb.closest('label') || document.querySelector('label[for="' + cb.id + '"]');
        var text = label ? label.textContent.trim() : '';
        if (text) availableTools.push(text);
      });

      log("scrapeLessonContext:", { grade: extractedGrade, subject: extractedSubject, lessonTitle: lessonTitle, availableStrategies: availableStrategies, availableTools: availableTools });
      return { grade: extractedGrade, subject: extractedSubject, lessonTitle: lessonTitle, availableStrategies: availableStrategies, availableTools: availableTools };

    }
    async function fetchAILessonData(context) {
      try {
        log("fetchAILessonData: sending to n8n:", context);
        var controller = new AbortController();
        var timeoutId = setTimeout(function () { controller.abort(); }, AI_WEBHOOK_TIMEOUT_MS);
        var response;
        try {
          response = await fetch(N8N_AI_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": N8N_AI_API_KEY
            },
            body: JSON.stringify({
              grade: context.grade,
              subject: context.subject,
              lesson_title: context.lessonTitle
            }),
            signal: controller.signal
          });
        } finally {
          clearTimeout(timeoutId);
        }
        if (!response.ok) {
          log("fetchAILessonData: HTTP error", response.status);
          return null;
        }
        var data = normalizeAIWebhookResponse(await response.json());
        log("fetchAILessonData: received:", data);
        return data;

      } catch (err) {
        log("fetchAILessonData: error:", err);
        return null;
      }
    }

    // ── Deprecated stub — kept so older call-sites do not throw ──────────────────
    // The parasite strategy replaces this. runQuickPrepStep2Flow no longer calls it.
    async function fetchQuickPrepData(subjectId, lessonId) {
      log('fetchQuickPrepData: deprecated — parasite strategy active');
      return null;
    }
    function buildLessonPlanFromGoals(goals, books, lessonName, tree2Value) {
      const name = lessonName || "الدرس";
      const einLink = "https://ibs.ien.edu.sa/#/planslessons/" + (tree2Value || "");
      const goalIds = Array.isArray(goals) ? goals.map(function (g) { return g.GoalId; }).filter(Boolean) : [];

      var firstGoalTitle = "";
      var lastGoalTitle = "";
      if (Array.isArray(goals) && goals.length > 0) {
        firstGoalTitle = (goals[0].GoalTitle || "").trim();
        lastGoalTitle = (goals[goals.length - 1].GoalTitle || "").trim();
      }

      var prepText, closeText, homeworkText;

      if (!Array.isArray(goals) || goals.length === 0) {
        // Zero goals: lesson-name-only templates
        prepText = "نراجع مع الطلاب المعارف السابقة، ثم نمهد لدرس \"" + name + "\" من خلال طرح موقف يومي مرتبط بموضوع الدرس.";
        closeText = "نلخص مع الطلاب أهم ما تعلموه في درس \"" + name + "\".";
        homeworkText = "حل تمارين درس \"" + name + "\" في كتاب التمارين.";
      } else if (goals.length === 1) {
        // One goal: different phrasing for prep vs closure so they are not identical
        prepText = "نراجع مع الطلاب المعارف السابقة، ثم نمهد لدرس \"" + name + "\" من خلال طرح موقف يومي مرتبط بـ " + firstGoalTitle + ".";
        closeText = "نلخص مع الطلاب أهم ما تعلموه في درس \"" + name + "\"، ونتأكد من تحقق الهدف: " + lastGoalTitle + ".";
        homeworkText = "حل تمارين درس \"" + name + "\" في كتاب التمارين، ومراجعة هدف: " + firstGoalTitle + ".";
      } else {
        // Two or more goals: first → prep, last → closure
        prepText = "نراجع مع الطلاب المعارف السابقة، ثم نمهد لدرس \"" + name + "\" من خلال طرح موقف يومي مرتبط بـ " + firstGoalTitle + ".";
        closeText = "نلخص مع الطلاب أهم ما تعلموه في درس \"" + name + "\"، ونتأكد من تحقق الهدف: " + lastGoalTitle + ".";
        homeworkText = "حل تمارين درس \"" + name + "\" في كتاب التمارين، ومراجعة هدف: " + firstGoalTitle + ".";
      }

      var vocabularyText =
        "مفردات الدرس: راجع الكتاب الإلكتروني درس (" + name + ").\n" +
        "تجد روابط الكتب الإلكترونية في قسم الإثراء.";

      var thinkingSkillsText =
        "التركيز - التذكر - التحليل - التركيب - الربط - الملاحظة - الاستنتاج - التفكير الإبداعي - العصف الذهني";

      var teacherNoteText =
        "بإمكانك الاطلاع على شرح هذا الدرس على منصة عين وحل بعض الأسئلة ومشاهدة المزيد من الإثراءات من خلال:\n" +
        "أولاً: تسجيل الدخول لمنصة عين بحسابك.\n" +
        "ثانياً: فتح رابط هذا الدرس وهو:\n" +
        einLink;

      return {
        LectureClassPreparationText: prepText,
        LessonVocabulary: vocabularyText,
        ThinkingSkills: thinkingSkillsText,
        LectureClassCloseText: closeText,
        TeacherNote: teacherNoteText,
        goalIds: goalIds,
        einLink: einLink,
        homework: homeworkText
      };
    }
    function getCsrfToken() {
      return getFieldValue("#csrfid") || getFieldValue('input[name="__RequestVerificationToken"]');
    }
    function getNumericSchoolIdValue(root) {
      const scopes = [root || document, document];
      const selectorCandidates = [
        '#SchoolId',
        'input[name="SchoolId"]',
        'input[name="schoolId"]',
        'input#schoolId'
      ];
      for (const scope of scopes) {
        for (const selector of selectorCandidates) {
          const value = getFieldValue(selector, scope);
          if (/^\d+$/.test(value)) return value;
        }
      }
      return '';
    }
    function getSchoolIdValue(root) {
      const candidates = [];
      function remember(value) {
        const s = String(value || "").trim();
        if (s && !candidates.includes(s)) candidates.push(s);
      }

      const scopes = [root || document, document];
      const selectorCandidates = [
        "#hSchoolId",
        'input[name="schoolId"]',
        "input#schoolId",
        'input[name="SchoolId"]',
        'input[name="SchoolIdEnc"]',
        'input[name="eschoolId"]'
      ];
      for (const scope of scopes) {
        for (const selector of selectorCandidates) {
          remember(getFieldValue(selector, scope));
        }
      }
      const globalCandidates = [
        globalThis.schoolId,
        globalThis.eschoolId,
        globalThis.SchoolIdEnc
      ];
      for (const candidate of globalCandidates) {
        remember(candidate);
      }
      const hrefSources = [
        getFieldValue("#hfDrawTree"),
        getFieldValue("#hfGetAssignment"),
        getFieldValue("#hfGradeBookTotalValue")
      ].filter(Boolean);
      for (const href of hrefSources) {
        remember(href);
        const indexMatch = href.match(/\/Index\/([^/?#]+)/i);
        if (indexMatch && indexMatch[1]) remember(indexMatch[1]);
        const queryMatch = href.match(/[?&](?:schoolId|eschoolId|SchoolId)=([^&#]+)/i);
        if (queryMatch && queryMatch[1]) {
          try {
            remember(decodeURIComponent(queryMatch[1]));
          } catch {
            remember(queryMatch[1]);
          }
        }
      }
      const hashCandidate = candidates.find(function (value) {
        return /^[a-f0-9]{32}$/i.test(value);
      });
      if (hashCandidate) return hashCandidate;
      const embeddedHashCandidate = candidates.map(function (value) {
        const m = value.match(/[a-f0-9]{32}/i);
        return m ? m[0] : "";
      }).find(Boolean);
      if (embeddedHashCandidate) return embeddedHashCandidate;
      if (candidates.length) return candidates[0];
      return "";
    }
    function matchesLessonRequirementError(text) {
      const normalized = (text || "").replace(/\s+/g, " ").trim();
      return LESSON_RESOURCE_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
    }
    function matchesSaveValidationError(text) {
      const normalized = (text || "").replace(/\s+/g, " ").trim();
      return SAVE_VALIDATION_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
    }
    function matchesDuplicateLessonError(text) {
      const normalized = (text || "").replace(/\s+/g, " ").trim();
      return DUPLICATE_LESSON_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
    }
    function findLessonRequirementErrorMessage() {
      if (!document.body) return "";
      const pageText = document.body.innerText || "";
      if (!matchesLessonRequirementError(pageText)) return "";
      const scopedCandidates = getVisibleElements(".swal2-html-container, .validation-summary-errors, .alert, .modal, .toast, .field-validation-error, div, p, span, li");
      const exactCandidate = scopedCandidates.find((element) => matchesLessonRequirementError(getElementLabel(element)));
      return exactCandidate ? getElementLabel(exactCandidate) : LESSON_RESOURCE_ERROR_PATTERNS[0];
    }
    function findSaveValidationErrorMessage() {
      if (!document.body) return "";
      const pageText = document.body.innerText || "";
      if (!matchesSaveValidationError(pageText)) return "";
      const scopedCandidates = getVisibleElements(".swal2-html-container, .validation-summary-errors, .alert, .modal, .toast, .field-validation-error, div, p, span, li");
      const exactCandidate = scopedCandidates.find((element) => matchesSaveValidationError(getElementLabel(element)));
      return exactCandidate ? getElementLabel(exactCandidate) : SAVE_VALIDATION_ERROR_PATTERNS[0];
    }
    function findDuplicateLessonErrorMessage() {
      if (!document.body) return "";
      const pageText = document.body.innerText || "";
      if (!matchesDuplicateLessonError(pageText)) return "";
      const scopedCandidates = getVisibleElements(".swal2-html-container, .validation-summary-errors, .alert, .modal, .toast, .field-validation-error, div, p, span, li");
      const exactCandidate = scopedCandidates.find((element) => matchesDuplicateLessonError(getElementLabel(element)));
      return exactCandidate ? getElementLabel(exactCandidate) : DUPLICATE_LESSON_ERROR_PATTERNS[0];
    }
    async function dismissLessonRequirementAlert() {
      const modal = findPreferredElement({
        attributes: [".swal2-popup", ".modal.show", ".modal.in", '[role="dialog"]'],
        classes: [".swal2-popup", ".modal.show", ".modal.in"]
      });
      if (!modal || !isTrulyVisible(modal)) return false;
      const confirmButton = findPreferredElement({
        root: modal,
        attributes: [".swal2-confirm", ".btn-primary", 'button[type="button"]'],
        classes: [".swal2-confirm", ".btn-primary", ".btn-main"],
        texts: ["\u0645\u0648\u0627\u0641\u0642", "\u062D\u0633\u0646\u0627", "\u062D\u0633\u0646\u064B\u0627", "\u0625\u063A\u0644\u0627\u0642", "\u0627\u063A\u0644\u0627\u0642", "\u062A\u0623\u0643\u064A\u062F", "\u0645\u0648\u0627\u0641\u0642"]
      });
      if (!confirmButton) return false;
      activateElementOnce(confirmButton);
      await sleep(500);
      return true;
    }
    async function fetchHtml(url, options) {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
          ...options || {}
        });
        const text = await response.text();
        return {
          ok: response.ok,
          status: response.status,
          text
        };
      } catch (error) {
        log("fetchHtml error:", error);
        return {
          ok: false,
          status: 0,
          text: ""
        };
      }
    }
    async function createSchoolActivityFallback(options) {
      const settings = options || {};
      if (hasInjectedFallbackResource && !settings.force) {
        return buildResult(true, "Fallback resource already created");
      }
      const schoolId = getSchoolIdValue();
      const unitId = getFieldValue("#SelectedUnitId");
      const tree2 = getFieldValue("#SelectedTrees_2");
      const tree3 = getFieldValue("#SelectedTrees_3");
      const tree4 = getFieldValue("#SelectedTrees_4");
      if (!schoolId || !unitId || !tree2 || !tree3) {
        return buildResult(false, "Missing lesson identifiers for school activity fallback");
      }
      const createPageResponse = await fetchHtml(`/Projects/Projects/Create?schoolId=${encodeURIComponent(schoolId)}`);
      if (!createPageResponse.ok || !createPageResponse.text) {
        return buildResult(false, "Could not open school activity creation page");
      }
      const createDocument = new DOMParser().parseFromString(createPageResponse.text, "text/html");
      const verificationToken = getFieldValue('[name="__RequestVerificationToken"]', createDocument);
      const hashKey = getFieldValue('[name="HashKey"]', createDocument);
      if (!verificationToken || !hashKey) {
        return buildResult(false, "Could not extract activity creation tokens");
      }
      const payload = new URLSearchParams();
      payload.append("TypeId", "1");
      payload.append("__RequestVerificationToken", verificationToken);
      payload.append("HashKey", hashKey);
      payload.append("Id", "");
      payload.append("schoolId", schoolId);
      payload.append("SelectedUnitId", unitId);
      payload.append("SelectedTrees_2", tree2);
      payload.append("SelectedTrees_3", tree3);
      if (tree4) payload.append("SelectedTrees_4", tree4);
      payload.append("Name", `\u0646\u0634\u0627\u0637 (${getCurrentLessonName()})`);
      payload.append("CategoryId", tree4 ? "1" : "4");
      payload.append("ClassificationLevel", "1");
      payload.append("ProjectType", "1");
      payload.append("Description", "\u0646\u0634\u0627\u0637 \u0645\u0646 \u0627\u0644\u0643\u062A\u0627\u0628 \u0645\u0631\u062A\u0628\u0637 \u0628\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062F\u0631\u0633\u060C \u0645\u0639 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0635\u0641\u062D\u0629 \u0648\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u064A\u0646.");
      payload.append("PageNumber", "13");
      payload.append("QuestionsNumber", "1");
      payload.append("SaveButton", "");
      if (tree4) {
        payload.append("hfLevelsCount", "4");
        payload.append("hfDrawTree", "/Projects/Projects/DrawTreeToClassLesson");
      } else {
        payload.append("hfLevelsCount", "3");
        payload.append("hfDrawTree", "/Projects/Projects/DrawTreeToClassLesson");
      }
      payload.append("SolvingType", "3");
      payload.append("AccessType", "False");
      const saveResponse = await fetchHtml("/Projects/Projects/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          requestverificationtoken: getCsrfToken() || verificationToken
        },
        body: payload.toString()
      });
      if (!saveResponse.ok) {
        return buildResult(false, "School activity fallback request failed");
      }
      await sleep(1200);
      const counts = getLessonResourceCounts();
      if (counts.hasAny) {
        hasInjectedFallbackResource = true;
        return buildResult(true, "School activity created and linked", { counts });
      }
      return buildResult(false, "School activity was created but not linked to the lesson");
    }
    async function createAssignmentFallback(options) {
      const settings = options || {};
      if (hasInjectedFallbackResource && !settings.force) {
        return buildResult(true, "Fallback resource already created");
      }
      const beforeCounts = getLessonResourceCounts();
      const csrfToken = getCsrfToken();
      const schoolId = getSchoolIdValue();
      const unitId = getFieldValue("#SelectedUnitId");
      const tree2 = getFieldValue("#SelectedTrees_2");
      const tree3 = getFieldValue("#SelectedTrees_3");
      const tree4 = getFieldValue("#SelectedTrees_4");
      const assignmentLessonId = tree4 || tree3;
      const assignmentParentId = tree4 ? tree3 : tree2;
      if (!csrfToken || !schoolId || !unitId || !tree2 || !tree3) {
        return buildResult(false, "Missing lesson identifiers for assignment fallback");
      }

      function formatResourceDate(d) {
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear();
        let hour = d.getHours();
        const min = String(d.getMinutes()).padStart(2, "0");
        const sec = String(d.getSeconds()).padStart(2, "0");
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        return `${month}/${day}/${year} ${hour}:${min}:${sec} ${ampm}`;
      }

      function parseResourceDate(value) {
        const s = String(value || "").trim();
        let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (m) {
          const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]), Number(m[4]), Number(m[5]), Number(m[6]));
          return isNaN(d.getTime()) ? null : d;
        }
        m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) {
          const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 8, 0, 0);
          return isNaN(d.getTime()) ? null : d;
        }
        return null;
      }

      function injectAssignmentIntoCurrentForm(assignmentId, attachData) {
        const forms = Array.from(document.querySelectorAll("form"));
        let saveForm = null;
        try {
          const saveButton = typeof findFinalSaveButtonSync === "function" ? findFinalSaveButtonSync() : null;
          saveForm = saveButton && typeof saveButton.closest === "function" ? saveButton.closest("form") : null;
        } catch {
          saveForm = null;
        }
        const form = saveForm || forms.map(function (f) {
          let score = 0;
          if (isTrulyVisible(f)) score += 4;
          if (f.querySelector('textarea[name], textarea[id]')) score += 10;
          if (f.querySelector('input[name="TimeTableId"]')) score += 8;
          if (f.querySelector('input[name="LectureClassPreparationText"], textarea[name="LectureClassPreparationText"], #LectureClassPreparationText')) score += 8;
          if (f.querySelector('input[name="TeacherNote"], textarea[name="TeacherNote"], #TeacherNote')) score += 4;
          if (f.querySelector('input[name="__RequestVerificationToken"]')) score += 2;
          return { form: f, score: score };
        }).sort(function (a, b) {
          return b.score - a.score;
        }).filter(function (entry) {
          return entry.score > 0;
        })[0]?.form || forms[0];
        if (!form) return false;

        Array.from(form.querySelectorAll('input[name]')).forEach(function (input) {
          if (String(input.name || "").indexOf("LectureAssignmentsList[") === 0) input.remove();
        });

        const rawStart = getFieldValue('input[name="MultiPrepareLesson[0].StartDate"]')
          || getFieldValue('input[name="StartDate"]')
          || getFieldValue("#StartDate");
        const startDate = parseResourceDate(rawStart) || new Date();
        const endDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        const fields = {
          "LectureAssignmentsList[0].AssignmentId": assignmentId,
          "LectureAssignmentsList[0].Grade": "1",
          "LectureAssignmentsList[0].IsGradeBook": attachData && attachData.isGradeBook != null ? String(attachData.isGradeBook) : "true",
          "LectureAssignmentsList[0].StartTime": attachData && attachData.startDateTime ? String(attachData.startDateTime) : formatResourceDate(startDate),
          "LectureAssignmentsList[0].EndTime": attachData && attachData.endDateTime ? String(attachData.endDateTime) : formatResourceDate(endDate),
          "LectureAssignmentsList[0].DayCount": "3"
        };
        Object.keys(fields).forEach(function (name) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = fields[name];
          form.appendChild(input);
        });
        console.log("[Moeen-2] Injected LectureAssignmentsList into native save form → AssignmentId:", assignmentId);
        return true;
      }

      try {
        const silentAssignmentId = await silentCreateHomeworkResource(unitId, assignmentParentId, assignmentLessonId, getCurrentLessonName(), schoolId);
        if (silentAssignmentId) {
          const rawStart = getFieldValue('input[name="MultiPrepareLesson[0].StartDate"]')
            || getFieldValue('input[name="StartDate"]')
            || getFieldValue("#StartDate");
          const attachResult = await silentAttachHomeworkToLecture({
            assignmentId: silentAssignmentId,
            subjectId: unitId,
            schoolId: getNumericSchoolIdValue() || '',
            timeTableId: getFieldValue('input[name="MultiPrepareLesson[0].TimeTableId"]') || getFieldValue('#TimeTableId'),
            startDateRaw: rawStart,
            endDateRaw: getFieldValue('input[name="MultiPrepareLesson[0].EndDate"]') || getFieldValue('input[name="EndDate"]'),
            isMulti: Boolean(getFieldValue('input[name="MultiPrepareLesson[0].TimeTableId"]')),
            dayCount: '3',
            assignmentType: '1',
            isGradeBook: true
          });
          if (!attachResult.ok) {
            console.warn("[Moeen-2] Assignment fallback: AddAssignmentToLecture did not confirm attach:", attachResult.message);
          }
          const attachData = attachResult.data || {};
          const injected = injectAssignmentIntoCurrentForm(silentAssignmentId, attachData);
          if (!injected) {
            return buildResult(false, "Assignment was created but could not be injected into the save form", { assignmentId: silentAssignmentId });
          }
          injectHomeworkIntoPageState(silentAssignmentId, attachData, {
            grade: '1',
            assignmentName: 'واجب (' + getCurrentLessonName() + ')',
            assignmentType: '1',
            dayCount: '3',
            timeTableId: getFieldValue('input[name="MultiPrepareLesson[0].TimeTableId"]') || getFieldValue('#TimeTableId'),
            startDateTime: attachData.startDateTime || '',
            endDateTime: attachData.endDateTime || ''
          });
          hasInjectedFallbackResource = true;
          return buildResult(true, "Assignment created and linked", { assignmentId: silentAssignmentId, attachStatus: attachResult.status });
        }
      } catch (silentErr) {
        console.warn("[Moeen-2] Assignment fallback: silent homework helper failed, trying legacy fallback:", silentErr && silentErr.message);
      }

      const payload = new URLSearchParams();
      payload.append("SaveButton", "");
      payload.append("IdEnc", "");
      payload.append("Id", "0");
      payload.append("TreeId", assignmentLessonId);
      payload.append("IsTreeLevel", "false");
      payload.append("IsQuran", "false");
      payload.append("txt_UploadUrl", "/Teacher/Assignments/UploadFile");
      payload.append("SelectedUnitId", unitId);
      payload.append("SelectedTrees_2", tree2);
      payload.append("SelectedTrees_3", tree3);
      if (tree4) payload.append("SelectedTrees_4", tree4);
      payload.append("selectedSubjectId", unitId);
      payload.append("selectedTreeId", assignmentParentId);
      payload.append("selectedLessonse", assignmentLessonId);
      payload.append("isNotUserLayout", "True");
      payload.append("Name", `\u0648\u0627\u062C\u0628 (${getCurrentLessonName()})`);
      payload.append("QuranLessonType", "1");
      payload.append("AssignmentType", "1");
      payload.append("Description", "\u0642\u0645 \u0628\u062D\u0644 \u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062F\u0631\u0633 \u0627\u0644\u0645\u062D\u062F\u062F\u0629 \u0645\u0646 \u0643\u062A\u0627\u0628 \u0627\u0644\u0637\u0627\u0644\u0628 \u0648\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u062F\u0627\u062E\u0644 \u0627\u0644\u0646\u0638\u0627\u0645.");
      payload.append("filePath", "");
      payload.append("PageNumber", "13");
      payload.append("QuestionsNumber", "1");
      payload.append("SolvingType", "2");
      payload.append("AccessType", "False");
      payload.append("schoolId", schoolId);
      payload.append(tree4 ? "hformrawTree" : "hfDrawTree", "/Teacher/Assignments/DrawTreeToClassLesson");
      payload.append("hfLevelsCount", tree4 ? "4" : "3");
      payload.append("X-Requested-With", "XMLHttpRequest");
      const saveResponse = await fetchHtml(`/Teacher/Assignments/Manage?isNotUserLayout=True&selectedSubjectId=${encodeURIComponent(unitId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          requestverificationtoken: csrfToken
        },
        body: payload.toString()
      });
      if (!saveResponse.ok) {
        return buildResult(false, "Assignment fallback request failed");
      }
      await sleep(1200);
      const counts = getLessonResourceCounts();
      if (counts.assignments && counts.assignments >= Math.max(1, beforeCounts.assignments || 0)) {
        hasInjectedFallbackResource = true;
        return buildResult(true, "Assignment created and linked", { counts });
      }
      if (counts.hasAny) {
        return buildResult(false, "Assignment fallback request completed but no assignment was linked", { counts });
      }
      return buildResult(false, "Assignment was created but not linked to the lesson");
    }
    async function ensureLessonRequirementSatisfied(options) {
      const settings = options || {};
      const initialCounts = getLessonResourceCounts();
      const hasVisibleResource = Boolean(
        initialCounts.enrichments || initialCounts.assignments || initialCounts.exams || initialCounts.projects
      );
      const hasKnownResource = settings.ignoreInjectedResource ? hasVisibleResource : initialCounts.hasAny;
      if (hasKnownResource && initialCounts.assignments) {
        return buildResult(true, "Lesson already has a resource", { counts: initialCounts });
      }

      // 1. Always try homework first unless the lesson already shows an assignment.
      // A visible activity/exam satisfies Madrasati validation, but it should not
      // suppress the homework linkage this extension is expected to add.
      const assignmentResult = await createAssignmentFallback({ force: true });
      if (assignmentResult.ok) {
        return assignmentResult;
      }
      if (hasKnownResource) {
        return buildResult(true, "Lesson already has another resource; assignment fallback failed", {
          counts: initialCounts,
          assignmentError: assignmentResult.message
        });
      }

      // 2. Silent POST School Activity Fallback
      const activityResult = await createSchoolActivityFallback({ force: true });
      if (activityResult.ok) {
        return activityResult;
      }

      // 3. Last resort: UI Project Flow
      const projectFlowResult = await handleProjectResourceFlow();
      if (projectFlowResult.ok) {
        return projectFlowResult;
      }

      return buildResult(false, "Could not add assignment or school activity in the background.");
    }
    async function ensureLessonGoalSelected(root) {
      const scope = getRootScope(root);
      if (!scope) return buildResult(true, "No enrichment scope found");
      const goalsSelect = scope.querySelector("#LessonsGoalsList");
      if (!goalsSelect) return buildResult(true, "No lesson goals selector found");
      const options = Array.from(goalsSelect.options || []).filter((option) => option.value && !option.disabled);
      if (!options.length) {
        return buildResult(false, "No lesson goals available");
      }
      const selectedValues = Array.from(goalsSelect.selectedOptions || []).map((option) => option.value).filter(Boolean);
      if (!selectedValues.length) {
        const firstGoal = options[0];
        firstGoal.selected = true;
        triggerEvents(goalsSelect, ["input", "change", "blur"]);
        const hiddenGoals = scope.querySelector('#SelectedGoles, input[name="SelectedGoles"]');
        if (hiddenGoals) {
          setNativeValue(hiddenGoals, firstGoal.value);
        }
        const checkboxSelector = `.multiselect-container input[type="checkbox"][value="${firstGoal.value}"]`;
        const goalCheckbox = scope.querySelector(checkboxSelector);
        if (goalCheckbox && !goalCheckbox.checked) {
          goalCheckbox.checked = true;
          triggerEvents(goalCheckbox, ["input", "change", "click", "blur"]);
        }
        const pluralHiddenGoals = scope.querySelector('input[name="Goals"], input[name="SelectedGoals"]');
        if (pluralHiddenGoals) {
          setNativeValue(pluralHiddenGoals, firstGoal.value);
        }
        const rootDocument = getRootDocument(scope);
        const rootWindow = rootDocument.defaultView || window;
        if (typeof rootWindow.changeGoals === "function") {
          try {
            rootWindow.changeGoals();
          } catch {
          }
        }
      }
      return buildResult(true, "Lesson goal selected");
    }
    async function fillEnrichmentCreationForm(root) {
      const scope = getRootScope(root);
      if (!scope) return buildResult(true, "No enrichment creation form found");
      const goalResult = await ensureLessonGoalSelected(scope);
      if (!goalResult.ok) return goalResult;
      const selects = Array.from(scope.querySelectorAll("select")).filter((select) => {
        if (select.id === "LessonsGoalsList") return false;
        return isTrulyVisible(select);
      });
      for (const select of selects) {
        const option = Array.from(select.options).find((item) => item.text && item.text.includes("\u0631\u0627\u0628\u0637"));
        if (option) {
          select.selectedIndex = option.index;
          triggerEvents(select, ["input", "change", "blur"]);
        }
      }
      const nameField = scope.querySelector('#txtName, #Name, input[name="txtName"], input[name="Name"]');
      const descriptionField = scope.querySelector('#txtHelpText, #Description, textarea[name="txtHelpText"], textarea[name="Description"], textarea');
      let urlField = scope.querySelector('#txtFullPath, input[name="txtFullPath"], input[name="FullPath"], input[name="Url"], input[type="url"]');
      if (!urlField) {
        urlField = Array.from(scope.querySelectorAll('input[type="text"], input[type="url"], input:not([type])')).find((input) => isTrulyVisible(input) && input !== nameField);
      }
      if (isTrulyVisible(nameField)) setNativeValue(nameField, "\u0625\u062B\u0631\u0627\u0621 \u062A\u0639\u0644\u064A\u0645\u064A \u0634\u0627\u0645\u0644 \u0644\u0644\u062F\u0631\u0633");
      if (isTrulyVisible(descriptionField)) setNativeValue(descriptionField, "\u0645\u0627\u062F\u0629 \u0625\u062B\u0631\u0627\u0626\u064A\u0629 \u0644\u062F\u0639\u0645 \u062A\u0639\u0644\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u0631\u0628\u0637 \u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0628\u0627\u0644\u062F\u0631\u0633.");
      if (isTrulyVisible(urlField)) setNativeValue(urlField, "https://ien.edu.sa");
      const saveButton = findPreferredElement({
        root: scope,
        attributes: [
          'button[onclick*="addAttchmentLink"]',
          'a[onclick*="addAttchmentLink"]',
          ".submit-form-btn",
          'button[type="submit"]',
          'input[type="submit"]'
        ],
        classes: [".submit-form-btn", ".btn-primary"],
        texts: ["\u062D\u0641\u0638"]
      });
      if (saveButton) {
        activateElementOnce(saveButton);
        await sleep(2500);
      }
      if (isSecondPageVisible()) {
        await returnToMainLessonPage();
      }
      return buildResult(true, "Enrichment handled");
    }
    function getProjectCreationRoot() {
      const iframeDocuments = Array.from(document.querySelectorAll("iframe")).map((iframe) => getIframeDocument(iframe)).filter(Boolean);
      const candidates = [
        ...Array.from(document.querySelectorAll('.modal.show, .modal.in, [role="dialog"]')),
        ...iframeDocuments,
        document
      ];
      for (const candidate of candidates) {
        const scope = getRootScope(candidate);
        if (!scope) continue;
        const isDocumentRoot = Boolean(candidate.body && typeof candidate.querySelector === "function");
        if (!isDocumentRoot && !isTrulyVisible(scope)) continue;
        const markers = Array.from(scope.querySelectorAll(
          '#Name, #CategoryId, #TotalGrade, input[name="ClassificationLevel"], input.ProjectType, input.SolvingType, button[type="submit"], .modal-footer .btn-primary, .card-footer .btn-primary'
        ));
        if (markers.some(isTrulyVisible)) {
          return scope;
        }
      }
      return null;
    }
    function setCheckedInput(input) {
      if (!input || input.disabled) return false;
      input.checked = true;
      simulateHumanClick(input);
      triggerEvents(input, ["input", "change", "click", "blur"]);
      return true;
    }
    function setSelectValue(select, preferredValues) {
      if (!select || select.disabled) return false;
      const values = Array.isArray(preferredValues) ? preferredValues : [preferredValues];
      const option = values.filter(Boolean).map((value) => Array.from(select.options || []).find((item) => item.value === String(value))).find(Boolean) || Array.from(select.options || []).find((item) => item.value && !item.disabled);
      if (!option) return false;
      select.value = option.value;
      triggerEvents(select, ["input", "change", "blur"]);
      return true;
    }
    async function fillActivitySchedulingFields(scope) {
      const isMulti = isMultiLessonMode(scope.ownerDocument || document);
      const targetValue = isMulti ? "2" : "1";
      const teachingModeRadio = scope.querySelector(`input[name="LessonType"][value="${targetValue}"]`) || (() => {
        return Array.from(scope.querySelectorAll('input[type="radio"]')).find((r) => {
          const txt = (r.closest("label, .form-check")?.innerText || r.value || "").replace(/\s+/g, " ");
          if (isMulti) {
            return txt.includes("\u063A\u064A\u0631 \u0645\u062A\u0632\u0627\u0645\u0646") || txt.includes("\u062A\u0639\u0644\u0645 \u0630\u0627\u062A\u064A");
          } else {
            return txt.includes("\u0645\u062A\u0632\u0627\u0645\u0646") && !txt.includes("\u063A\u064A\u0631 \u0645\u062A\u0632\u0627\u0645\u0646") || txt.includes("\u064A\u0633\u062A\u0644\u0632\u0645 \u062D\u0636\u0648\u0631");
          }
        });
      })();
      if (teachingModeRadio && !teachingModeRadio.disabled) {
        setCheckedInput(teachingModeRadio);
        await sleep(400);
      }
      const radioSlotContainers = Array.from(scope.querySelectorAll(".radio-slots"));
      if (radioSlotContainers.length) {
        for (const container of radioSlotContainers) {
          const radios = Array.from(container.querySelectorAll('input[type="radio"]')).filter((r) => !r.disabled && isTrulyVisible(r));
          if (!radios.length) continue;
          if (!radios.some((r) => r.checked)) {
            setCheckedInput(radios[0]);
          }
        }
      } else {
        const seenGroups = /* @__PURE__ */ new Set();
        const periodRadios = Array.from(scope.querySelectorAll('input[type="radio"][name^="r_"]')).filter((r) => !r.disabled && isTrulyVisible(r));
        for (const radio of periodRadios) {
          const group = radio.name;
          if (seenGroups.has(group)) continue;
          seenGroups.add(group);
          const groupRadios = periodRadios.filter((r) => r.name === group);
          if (!groupRadios.some((r) => r.checked)) {
            setCheckedInput(groupRadios[0]);
          }
        }
      }
      const daysField = scope.querySelector('input[name="DayCount"]') || scope.querySelector('input[id^="DayCount_"]') || (() => {
        return Array.from(scope.querySelectorAll('input[type="number"]')).find((input) => {
          const nearby = input.closest(".position-relative, .form-group, .row")?.innerText || "";
          return /أيام|يوم|deadline|days/i.test(nearby);
        });
      })();
      if (daysField && isTrulyVisible(daysField) && !daysField.disabled) {
        setNativeValue(daysField, "3");
      }
      const gradeBookCheckbox = scope.querySelector('input[type="checkbox"][name^="isGradeBook"]') || scope.querySelector('input[type="checkbox"][id^="isGradeBook"]') || (() => {
        return Array.from(scope.querySelectorAll('input[type="checkbox"]')).find((cb) => {
          const labelText = (cb.closest("label")?.innerText || cb.parentElement?.innerText || "").replace(/\s+/g, " ");
          return labelText.includes("\u0633\u062C\u0644 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u064A\u0648\u0645\u064A");
        });
      })();
      if (gradeBookCheckbox && !gradeBookCheckbox.disabled && !gradeBookCheckbox.checked) {
        setCheckedInput(gradeBookCheckbox);
      }
    }
    async function submitProjectCreationForm(root) {
      const scope = getRootScope(root);
      if (!scope) return buildResult(false, "Project creation form is unavailable");
      const lessonTreeValue = getFieldValue("#SelectedTrees_4") || getFieldValue("#SelectedTrees_3");
      const nameField = scope.querySelector('#Name, input[name="Name"]');
      const descriptionField = scope.querySelector('#Description, textarea[name="Description"]');
      const linkField = scope.querySelector('#Link, input[name="Link"], input[placeholder*="http"]');
      const gradeField = scope.querySelector('#TotalGrade, input[name="TotalGrade"]');
      const pageNumberField = scope.querySelector('#PageNumber, input[name="PageNumber"]');
      const questionNumberField = scope.querySelector('#QuestionsNumber, input[name="QuestionsNumber"]');
      const hiddenProjectTypeField = scope.querySelector('#ProjectType, input[name="ProjectType"]');
      const categorySelect = scope.querySelector('#CategoryId, select[name="CategoryId"]');
      const classificationRadio = scope.querySelector("#classificationLevel1") || scope.querySelector('input[name="ClassificationLevel"][value="1"]');
      const relatedToSubjectRadio = scope.querySelector("#IsRelatedToSubject") || scope.querySelector('input[name="IsRelatedToSubject"][value="true"]');
      const projectTypeRadio = scope.querySelector("#ProjectType1") || scope.querySelector('input[name="ProjectType"][value="1"]') || scope.querySelector("#ProjectType4") || scope.querySelector('input[name="ProjectType"][value="4"]') || scope.querySelector('input[name="ProjectType"]:checked') || scope.querySelector('input[name="ProjectType"]');
      const solvingTypeRadio = scope.querySelector("#OutsideSystem") || scope.querySelector('input[name="SolvingType"][value="3"]') || scope.querySelector('input[name="SolvingType"]:checked') || scope.querySelector('input[name="SolvingType"]');
      if (isTrulyVisible(nameField)) {
        setNativeValue(nameField, `\u0646\u0634\u0627\u0637 (${getCurrentLessonName()})`);
      }
      if (classificationRadio) {
        setCheckedInput(classificationRadio);
      }
      if (relatedToSubjectRadio && isTrulyVisible(relatedToSubjectRadio)) {
        setCheckedInput(relatedToSubjectRadio);
      }
      if (categorySelect) {
        setSelectValue(categorySelect, lessonTreeValue ? ["1", "4"] : ["4", "1"]);
      }
      if (projectTypeRadio) {
        setCheckedInput(projectTypeRadio);
      }
      if (hiddenProjectTypeField) {
        const preferredProjectType = projectTypeRadio && projectTypeRadio.value ? projectTypeRadio.value : "1";
        setNativeValue(hiddenProjectTypeField, preferredProjectType);
      }
      if (descriptionField) {
        setNativeValue(
          descriptionField,
          "\u0646\u0634\u0627\u0637 \u0645\u0646 \u0627\u0644\u0643\u062A\u0627\u0628 \u0645\u0631\u062A\u0628\u0637 \u0628\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062F\u0631\u0633\u060C \u0645\u0639 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0635\u0641\u062D\u0629 \u0648\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u064A\u0646."
        );
      }
      if (linkField) {
        setNativeValue(linkField, "");
      }
      if (gradeField && isTrulyVisible(gradeField)) {
        setNativeValue(gradeField, "10");
      }
      if (pageNumberField && isTrulyVisible(pageNumberField)) {
        setNativeValue(pageNumberField, "13");
      }
      if (questionNumberField && isTrulyVisible(questionNumberField)) {
        setNativeValue(questionNumberField, "1");
      }
      if (solvingTypeRadio) {
        setCheckedInput(solvingTypeRadio);
      }
      const saveButton = findPreferredElement({
        root: scope,
        attributes: [
          'button[type="submit"]',
          'input[type="submit"]',
          ".modal-footer .btn-primary",
          ".card-footer .btn-primary"
        ],
        classes: [".btn-primary", ".submit-form-btn", ".btn-main"],
        texts: ["\u062D\u0641\u0638", "\u0625\u0636\u0627\u0641\u0629"]
      });
      if (!saveButton) {
        return buildResult(false, "Could not find the project save button");
      }
      await fillActivitySchedulingFields(scope);
      activateElementOnce(saveButton);
      await sleep(2600);
      return buildResult(true, "Project creation submitted");
    }
    function getProjectEntryIds(root) {
      const scope = root || document;
      return Array.from(scope.querySelectorAll('[id^="ProjectId_"]')).map((input) => {
        const match = input.id.match(/^ProjectId_(.+)$/);
        return match ? match[1] : "";
      }).filter(Boolean);
    }
    function openProjectSelectionModal(projectId, root) {
      const scope = root || document;
      const selectors = [
        `[data-bs-target="#selectProjectForm_${projectId}"]`,
        `[href="#selectProjectForm_${projectId}"]`,
        `[onclick*="selectProjectForm_${projectId}"]`,
        `[onclick*="setDefaultDates(${projectId})"]`
      ];
      for (const selector of selectors) {
        const button = scope.querySelector(selector);
        if (button && isTrulyVisible(button)) {
          activateElementOnce(button);
          return true;
        }
      }
      return false;
    }
    async function attachProjectToLesson(projectId, root) {
      // FIX 3: Wrap modal open + setDefaultDates in try/catch so optional UI
      // failures don't crash the entire AI flow.
      try {
        openProjectSelectionModal(projectId, root);
      } catch (err) {
        log("attachProjectToLesson: openProjectSelectionModal error:", err);
      }
      await sleep(800);
      try {
        if (typeof globalThis.setDefaultDates === "function") {
          globalThis.setDefaultDates(projectId);
        }
      } catch (err) {
        log("attachProjectToLesson: setDefaultDates error:", err);
      }
      try {
        const gradeField = document.getElementById(`gradeInProject_${projectId}`);
        if (gradeField && !(gradeField.value || "").trim()) {
          setNativeValue(gradeField, "10");
        }
      } catch (err) {
        log("attachProjectToLesson: gradeField error:", err);
      }
      const modalRoot = document.getElementById(`selectProjectForm_${projectId}`) || document;
      const addButton = findPreferredElement({
        root: modalRoot,
        attributes: [
          `button[onclick*="check(${projectId})"]`,
          `a[onclick*="check(${projectId})"]`
        ],
        classes: [".btn-primary", ".btn-main"],
        texts: ["\u0625\u0636\u0627\u0641\u0629", "\u062D\u0641\u0638"]
      });
      try {
        await fillActivitySchedulingFields(modalRoot);
      } catch (err) {
        log("attachProjectToLesson: fillActivitySchedulingFields error:", err);
      }
      if (addButton && isTrulyVisible(addButton)) {
        activateElementOnce(addButton);
      } else if (typeof globalThis.check === "function") {
        try {
          const result = globalThis.check(projectId);
          if (result === false) {
            return buildResult(false, "Project validation failed before attaching to the lesson");
          }
        } catch (error) {
          log("check(projectId) error:", error);
          return buildResult(false, "Could not attach the project to the lesson");
        }
      } else {
        return buildResult(false, "Could not find the project attach action");
      }
      const linked = await waitForValue(() => {
        const counts = getLessonResourceCounts();
        return counts.projects || counts.hasAny ? counts : null;
      }, 12e3, 250);
      if (linked) {
        hasInjectedFallbackResource = true;
        return buildResult(true, "Project linked to the lesson", { counts: linked });
      }
      return buildResult(false, "Project was created but not linked to the lesson");
    }
    async function handleProjectResourceFlow() {
      const existingCounts = getLessonResourceCounts();
      if (existingCounts.projects || existingCounts.hasAny) {
        return buildResult(true, "Lesson already has a linked project", { counts: existingCounts });
      }
      if (!isSecondPageVisible()) {
        const projectButton = findPreferredElement({
          attributes: [
            '[onclick*="loadProjects"]',
            '[onclick*="GetProjectsList"]',
            `[onclick*="showhidedivs('mainPage', 'secondPage')"]`
          ],
          classes: [".btn-outline-info", ".btn-main"],
          texts: ["\u0625\u0636\u0627\u0641\u0629 \u0646\u0634\u0627\u0637"]
        });
        if (!projectButton) {
          return buildResult(false, "Could not find the school activity button");
        }
        activateElementOnce(projectButton);
        await sleep(1600);
      }
      const secondPage = await waitForValue(
        () => isSecondPageVisible() ? document.getElementById("secondPage") || document : null,
        8e3
      );
      if (!secondPage) {
        return buildResult(false, "School activity bank page did not open");
      }
      let projectIds = getProjectEntryIds(secondPage);
      if (!projectIds.length) {
        const createButton = findPreferredElement({
          root: secondPage,
          attributes: [
            'a[onclick*="/Projects/Projects/Create"]',
            'button[onclick*="/Projects/Projects/Create"]',
            'a[onclick*="openCreationModal"]',
            'button[onclick*="openCreationModal"]'
          ],
          classes: [".btn-primary", ".btn-main"],
          texts: ["\u0625\u0636\u0627\u0641\u0629 \u0646\u0634\u0627\u0637"]
        });
        if (!createButton) {
          await returnToMainLessonPage();
          return buildResult(false, "No project is available and the project creation button was not found");
        }
        activateElementOnce(createButton);
        await sleep(1800);
        const creationRoot = await waitForValue(() => getProjectCreationRoot(), 8e3);
        if (!creationRoot) {
          await returnToMainLessonPage();
          return buildResult(false, "Project creation form did not open");
        }
        const creationResult = await submitProjectCreationForm(creationRoot);
        if (!creationResult.ok) {
          await returnToMainLessonPage();
          return creationResult;
        }
        await waitForValue(() => isSecondPageVisible() ? true : null, 8e3);
        await sleep(1600);
        projectIds = getProjectEntryIds(document.getElementById("secondPage") || document);
      }
      if (!projectIds.length) {
        await returnToMainLessonPage();
        return buildResult(false, "No project was available to attach after creation");
      }
      const attachResult = await attachProjectToLesson(projectIds[0], document.getElementById("secondPage") || document);
      await returnToMainLessonPage();
      return attachResult;
    }
    async function handleSecondPageEnrichmentFlow() {
      try {
        const secondPage = document.getElementById("secondPage");
        if (!isTrulyVisible(secondPage)) return buildResult(true, "Enrichment bank page not visible");

        // 1. التعديل الجديد: البحث عن زرار "اختر الإثراء" لو الإثراء موجود مسبقاً
        const selectExistingBtn = findPreferredElement({
          root: secondPage,
          attributes: ['[onclick*="check"]', '[onclick*="Select"]', '[onclick*="select"]'],
          classes: ['.btn-success', '.btn-primary'],
          texts: ["اختر الإثراء", "اختر", "إختيار"]
        });

        if (selectExistingBtn) {
          log("Found existing enrichment, clicking 'Choose'...");
          activateElementOnce(selectExistingBtn);
          await sleep(3000); // انتظار حتى يتم ربط الإثراء
          if (isSecondPageVisible()) {
            await returnToMainLessonPage();
          }
          return buildResult(true, "Selected existing enrichment from bank");
        }

        // 2. لو مفيش إثراء موجود، يروح يضغط على "إضافة إثراء" لإنشاء واحد جديد
        const createButton = findPreferredElement({
          root: secondPage,
          attributes: [
            'a[onclick*="openCreationModal"]',
            'button[onclick*="openCreationModal"]'
          ],
          classes: [".btn-primary"],
          texts: ["إضافة إثراء", "اضافة اثراء"]
        });

        const noItemsMessage = findElementByText("div, span, p", "لايوجد إثراءات يمكن عرضها", secondPage) || findElementByText("div, span, p", "لايوجد  إثراءات يمكن عرضها", secondPage);

        if ((noItemsMessage || createButton) && createButton) {
          activateElementOnce(createButton);
          await sleep(2000);
        }

        const creationRoot = await waitForValue(() => getEnrichmentCreationRoot(), 7000);
        if (creationRoot) {
          return await fillEnrichmentCreationForm(creationRoot);
        }

        await returnToMainLessonPage();
        return buildResult(true, "Could not handle enrichment bank, returned to lesson form");

      } catch (error) {
        log("handleSecondPageEnrichmentFlow error:", error);
        await returnToMainLessonPage();
        return buildResult(false, "Error in enrichment flow: " + error.message);
      }
    }
    async function handleEnrichmentForm() {
      const directCreationRoot = getEnrichmentCreationRoot();
      if (directCreationRoot) {
        return fillEnrichmentCreationForm(directCreationRoot);
      }
      let enrichButton = findPreferredElement({
        attributes: [
          '[onclick*="loadActivities"]',
          '[onclick*="searchActivitesList"]',
          `[onclick*="showhidedivs('mainPage', 'secondPage')"]`
        ],
        classes: [".add-resource-btn"],
        texts: ["\u0625\u0636\u0627\u0641\u0629 \u0625\u062B\u0631\u0627\u0621"]
      });
      if (!enrichButton) return buildResult(true, "No enrichment form found");
      activateElementOnce(enrichButton);
      await sleep(1400);
      const nextTarget = await waitForValue(
        () => getEnrichmentCreationRoot() || (isSecondPageVisible() ? "SECOND_PAGE" : null),
        8e3
      );
      if (nextTarget === "SECOND_PAGE" || isSecondPageVisible()) {
        return handleSecondPageEnrichmentFlow();
      }
      if (nextTarget && nextTarget !== "SECOND_PAGE") {
        return fillEnrichmentCreationForm(nextTarget);
      }
      return buildResult(true, "Enrichment form did not open");
    }

    // src/content/step1-flow.js
    function findNextButton() {
      return findPreferredElement({
        ids: ["next", "btnNext"],
        attributes: [
          'a[onclick*="firstLessonDetailsPageSuccess"]',
          'a[href="#next"]',
          'button[data-action="next"]'
        ],
        classes: [".wizard-next", ".next-btn", ".btn-next"],
        texts: ["\u0627\u0644\u062A\u0627\u0644\u064A"]
      });
    }
    async function selectRequiredRadio(text) {
      const label = findElementByText("label, div, span, button, a", text);
      if (label) {
        simulateHumanClick(label);
        return true;
      }
      const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
      for (const radio of radios) {
        const relatedText = [
          radio.value,
          radio.getAttribute("aria-label"),
          radio.parentElement && radio.parentElement.innerText
        ].filter(Boolean).join(" ");
        if (relatedText.includes(text)) {
          radio.checked = true;
          simulateHumanClick(radio);
          triggerEvents(radio, ["input", "change", "click", "blur"]);
          return true;
        }
      }
      return false;
    }
    async function runStep1Flow() {
      // ── Snapshot IDs into sessionStorage FIRST — before any DOM mutations ──────
      // The radio-button interactions below (LessonType, TARGET_RADIOS) trigger a
      // React state wipe that clears #SelectedUnitId and #SelectedTrees_* from the
      // DOM.  We must capture the user's manually-chosen values at the very instant
      // the button is clicked, before we touch anything else on the page.
      try {
        const _snapUnitId = getFieldValue("#SelectedUnitId");
        const _snapTree2 = getFieldValue("#SelectedTrees_2");
        const _snapTree3 = getFieldValue("#SelectedTrees_3");
        const _snapTree4 = getFieldValue("#SelectedTrees_4");
        const _snapTree5 = getFieldValue("#SelectedTrees_5");
        const _snapPayload = JSON.stringify({
          subjectId: _snapUnitId,
          tree2: _snapTree2,
          tree3: _snapTree3,
          lessonId: _snapTree4 || _snapTree3,   // tree4 when present, else tree3
          tree5: _snapTree5
        });
        window.sessionStorage.setItem("Moeen-2_quick_ids", _snapPayload);
        console.log("[مُعين-2] Step1: snapshotted IDs into sessionStorage:", _snapPayload);
      } catch (_snapErr) {
        console.warn("[مُعين-2] Step1: could not snapshot IDs", _snapErr);
      }
      // ─────────────────────────────────────────────────────────────────────────
      updatePrimaryButton("\u062C\u0627\u0631\u064A \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0627\u0631...", "loading");
      updateControlStatus("\u064A\u062A\u0645 \u0627\u0644\u0622\u0646 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0648\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0631\u0633 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629...", "info");
      // Check for stored dashboard selection
      const dashboardSelection = await getDashboardSelectionForCurrentLesson();
      if (dashboardSelection) {
        log("Step1: found dashboard selection for", dashboardSelection.lessonId);
        updateControlStatus("\u062A\u0637\u0628\u064A\u0642 \u0627\u062E\u062A\u064A\u0627\u0631 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0636\u064A\u0631...", "info"); // تطبيق اختيار لوحة التحضير...
        await applyDashboardSelections(dashboardSelection);
        await clearDashboardSelection(dashboardSelection.lessonId);
      } else {
        // FIX 1: Only auto-select last option if the dropdown is currently empty.
        // If the user has already made a manual selection, preserve it.
        const firstSelect = document.getElementById("SelectedUnitId");
        if (isTrulyVisible(firstSelect) && !firstSelect.value) {
          await selectLastOption(firstSelect);
        }
        for (let index = 2; index <= 6; index++) {
          const select = await waitForOptions(`SelectedTrees_${index}`, 7e3);
          if (select && isTrulyVisible(select) && !select.value) {
            await selectLastOption(select);
          }
        }
      }
      const isMulti = isMultiLessonMode();
      const targetValue = isMulti ? "2" : "1";
      const fallbackText = isMulti ? "\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u063A\u064A\u0631 \u0645\u062A\u0632\u0627\u0645\u0646" : "\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0645\u062A\u0632\u0627\u0645\u0646";
      const teachingModeRadio = document.querySelector(`input[name="LessonType"][value="${targetValue}"]`);
      if (teachingModeRadio && !teachingModeRadio.disabled) {
        if (!teachingModeRadio.checked) {
          setCheckedInput(teachingModeRadio);
          await sleep(500);
        }
      } else {
        await selectRequiredRadio(fallbackText);
      }
      for (const radioText of TARGET_RADIOS) {
        await selectRequiredRadio(radioText);
      }
      await fillActivitySchedulingFields(document.body);
      await sleep(1200);
      const nextButton = findNextButton();
      if (!nextButton) {
        throw new Error("\u062A\u0639\u0630\u0631 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u062A\u0627\u0644\u064A");
      }
      if (!tryAcquireActionLock("step1-next", STEP1_NEXT_LOCK_TTL_MS)) {
        updateControlStatus("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0645\u0633\u0628\u0642\u064B\u0627 \u0644\u0647\u0630\u0627 \u0627\u0644\u062F\u0631\u0633. \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062F\u0631\u0633...", "info");
        return buildResult(true, "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0645\u0633\u0628\u0642\u064B\u0627");
      }

      activateElementOnce(nextButton);
      lockActionElement(nextButton);
      const duplicateLessonError = await waitForValue(() => findDuplicateLessonErrorMessage(), 3e3, 250);
      if (duplicateLessonError) {
        releaseActionLock("step1-next");
        unlockActionElement(nextButton);
        return buildResult(false, duplicateLessonError, { code: "duplicate-lesson" });
      }
      updateControlStatus("\u062A\u0645 \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0627\u0631 \u0628\u0646\u062C\u0627\u062D. \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062F\u0631\u0633...", "success");
      return buildResult(true, "\u062A\u0645\u062A \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0628\u0646\u062C\u0627\u062D");
    }

    // src/content/settings.js
    var currentSaveSelector = SETTINGS_DEFAULTS.defaultSelector || DEFAULT_SAVE_SELECTOR;
    function getCurrentSaveSelector() {
      return currentSaveSelector;
    }
    function getSelectorProfile() {
      return getSync([
        STORAGE_KEYS.DEFAULT_SELECTOR || "defaultSelector",
        STORAGE_KEYS.SITE_PROFILES || "siteProfiles"
      ]).then((result) => {
        const profiles = result[STORAGE_KEYS.SITE_PROFILES || "siteProfiles"] || SETTINGS_DEFAULTS.siteProfiles || {};
        const currentProfile = profiles[window.location.hostname] || {};
        currentSaveSelector = currentProfile.selector || result[STORAGE_KEYS.DEFAULT_SELECTOR || "defaultSelector"] || SETTINGS_DEFAULTS.defaultSelector || '.submit-form-btn, #sub, a[href="#finish"]';
        return {
          selector: currentSaveSelector
        };
      }).catch(() => ({
        selector: currentSaveSelector
      }));
    }

    // src/content/step2-flow.js
    var isSaving = false;
    function resetSaving() {
      isSaving = false;
    }
    async function markLessonCheckboxes(aiData) {
      const lessonRoot = getLessonFormRoot();
      const processedGroups = new Set();
      for (const selector of REQUIRED_LESSON_CHECKBOX_GROUPS) {
        const checkboxes = Array.from(lessonRoot.querySelectorAll(selector)).filter(isCheckboxUsable);
        if (checkboxes.length > 0) {
          let matched = false;

          if (selector === 'input[name="strategies"]') {
            // 1. Try matching with AI strategies
            if (aiData && aiData.strategies && Array.isArray(aiData.strategies)) {
              var selectedStrategies = aiData.strategies;
              for (var cb of checkboxes) {
                var labelEl = cb.closest("label") || (cb.id ? document.querySelector('label[for="' + CSS.escape(cb.id) + '"]') : null);
                var labelText = labelEl ? (labelEl.textContent || "").trim() : (cb.parentElement ? cb.parentElement.textContent || "" : "").trim();
                if (labelText && selectedStrategies.includes(labelText)) {
                  ensureCheckboxChecked(cb);
                  matched = true;
                }
              }
            }
            // 2. Random fallback: Choose 2 to 4 strategies randomly
            if (!matched) {
              const shuffled = checkboxes.slice().sort(function() { return 0.5 - Math.random(); });
              const count = Math.floor(Math.random() * 3) + 2; // 2 to 4
              const selected = shuffled.slice(0, Math.min(count, checkboxes.length));
              selected.forEach(cb => ensureCheckboxChecked(cb));
              matched = true;
            }
          } else if (selector === 'input[name="teachingTools"]') {
            // 1. Try matching with AI tools
            if (aiData && aiData.tools && Array.isArray(aiData.tools)) {
              var selectedTools = aiData.tools;
              for (var cb of checkboxes) {
                var labelEl = cb.closest("label") || (cb.id ? document.querySelector('label[for="' + CSS.escape(cb.id) + '"]') : null);
                var labelText = labelEl ? (labelEl.textContent || "").trim() : (cb.parentElement ? cb.parentElement.textContent || "" : "").trim();
                if (labelText && selectedTools.includes(labelText)) {
                  ensureCheckboxChecked(cb);
                  matched = true;
                }
              }
            }
            // 2. Random fallback: Choose 3 to 5 teaching tools randomly
            if (!matched) {
              const shuffled = checkboxes.slice().sort(function() { return 0.5 - Math.random(); });
              const count = Math.floor(Math.random() * 3) + 3; // 3 to 5
              const selected = shuffled.slice(0, Math.min(count, checkboxes.length));
              selected.forEach(cb => ensureCheckboxChecked(cb));
              matched = true;
            }
          } else {
            // Original logic for other groups (goals / activities)
            if (aiData && aiData.strategies && Array.isArray(aiData.strategies)) {
              var selectedStrategies = aiData.strategies;
              for (var cb of checkboxes) {
                var labelEl = cb.closest("label") || (cb.id ? document.querySelector('label[for="' + CSS.escape(cb.id) + '"]') : null);
                var labelText = labelEl ? (labelEl.textContent || "").trim() : (cb.parentElement ? cb.parentElement.textContent || "" : "").trim();
                if (labelText && selectedStrategies.includes(labelText)) {
                  ensureCheckboxChecked(cb);
                  matched = true;
                }
              }
            }
            if (!matched) {
              const targetLabels = ["التعلم التعاوني", "العصف الذهني", "الكتاب", "السبورة التقليدية", "جهاز عرض البيانات", "التعلم الذاتي"];
              let selectedCount = 0;
              for (const cb of checkboxes) {
                const labelEl = cb.closest("label") || (cb.id ? document.querySelector('label[for="' + CSS.escape(cb.id) + '"]') : null);
                const labelText = labelEl ? (labelEl.textContent || "").trim() : (cb.parentElement ? cb.parentElement.textContent || "" : "").trim();

                if (targetLabels.some(t => labelText.includes(t))) {
                  ensureCheckboxChecked(cb);
                  selectedCount++;
                }
                if (selectedCount >= 2) break; // limit to 2 per group
              }

              // If our specific targets weren't found, fallback to first item
              if (selectedCount === 0 && checkboxes.length > 0) {
                ensureCheckboxChecked(checkboxes[0]);
              }
            }
          }
        }
        const sample = lessonRoot.querySelector(selector);
        if (sample && sample.name) processedGroups.add(sample.name);
      }
      const fallbackCheckboxes = Array.from(
        lessonRoot.querySelectorAll('.required input[type="checkbox"], .required input.radio-as-checkbox')
      );
      for (const checkbox of fallbackCheckboxes) {
        if (!isCheckboxUsable(checkbox)) continue;
        const groupKey = checkbox.name || checkbox.id || checkbox.className || `checkbox-${processedGroups.size}`;
        if (processedGroups.has(groupKey)) continue;
        processedGroups.add(groupKey);
        ensureCheckboxChecked(checkbox);
      }

      // ── Select digital content items (onclick="loadLessonItem(...)") if not already selected ──
      const activitiesCheckboxes = Array.from(lessonRoot.querySelectorAll('input[name="activities"]'));
      const anyChecked = activitiesCheckboxes.some(cb => cb.checked);
      if (!anyChecked) {
        // If there are input checkboxes for activities, check the first one
        const usableActivities = activitiesCheckboxes.filter(isCheckboxUsable);
        if (usableActivities.length > 0) {
          ensureCheckboxChecked(usableActivities[0]);
        } else {
          // If no usable checkboxes, look for loadLessonItem click targets
          const clickTargets = Array.from(lessonRoot.querySelectorAll('[onclick*="loadLessonItem"]'));
          if (clickTargets.length > 0) {
            log("[Moeen-2] Clicking first loadLessonItem target to select digital content");
            simulateHumanClick(clickTargets[0]);
          }
        }
      }
    }
    function fillSpecificLessonFields(root) {
      let filled = false;
      for (const [fieldId, fieldValue] of Object.entries(EXPLICIT_LESSON_FIELD_VALUES)) {
        const field = root.querySelector(`#${CSS.escape(fieldId)}`);
        if (!field || !isTrulyVisible(field) || field.disabled || field.readOnly) continue;
        setNativeValue(field, fieldValue);
        filled = true;
      }
      const examGoalField = root.querySelector(".publish-ixam-goal");
      if (examGoalField && isTrulyVisible(examGoalField) && !examGoalField.disabled && !examGoalField.readOnly) {
        setNativeValue(examGoalField, "\u062A\u062D\u0642\u064A\u0642 \u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u062F\u0631\u0633 \u0648\u0642\u064A\u0627\u0633 \u0641\u0647\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u0644\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629.");
        filled = true;
      }
      const examTeacherNote = root.querySelector(".lesson-exam-teacher-note");
      if (examTeacherNote && isTrulyVisible(examTeacherNote) && !examTeacherNote.disabled && !examTeacherNote.readOnly) {
        setNativeValue(examTeacherNote, EXPLICIT_LESSON_FIELD_VALUES.TeacherNote);
        filled = true;
      }
      return filled;
    }
    async function fillLessonFields(aiData) {
      const lessonRoot = getLessonFormRoot();
      const currentLessonName = getCurrentLessonName();
      const hasAI = aiData && typeof aiData === "object";

      // 1. Fill specific named fields — override with AI data where applicable
      if (hasAI) {
        // Map AI closure to LectureClassCloseText if available
        var aiClosureText = aiData.closure || aiData.LectureClassCloseText || "";
        if (aiClosureText) {
          var closeField = lessonRoot.querySelector("#LectureClassCloseText");
          if (closeField && isTrulyVisible(closeField) && !closeField.disabled && !closeField.readOnly) {
            setNativeValue(closeField, aiClosureText);
          }
        }
        // Map AI preparation to LectureClassPreparationText if available
        var aiPrepText = aiData.prep || aiData.LectureClassPreparationText || aiData.goals || "";
        if (aiPrepText) {
          var prepField = lessonRoot.querySelector("#LectureClassPreparationText");
          if (prepField && isTrulyVisible(prepField) && !prepField.disabled && !prepField.readOnly) {
            setNativeValue(prepField, aiPrepText);
          }
        }
      }
      fillSpecificLessonFields(lessonRoot);

      // 2. Fill textareas — use AI goals/closure or fallback to competitor text
      const textareas = getVisibleElements("textarea", lessonRoot).filter((field) => !field.closest("#CreateResourceForm"));
      for (let i = 0; i < textareas.length; i++) {
        const textarea = textareas[i];
        if ((textarea.value || "").trim()) continue;

        if (hasAI) {
          // Alternate between preparation/goals and closure for textareas
          var aiText = (i % 2 === 0)
            ? (aiData.prep || aiData.LectureClassPreparationText || aiData.goals || "")
            : (aiData.closure || aiData.LectureClassCloseText || "");
          if (aiText.trim()) {
            setNativeValue(textarea, aiText);
            continue;
          }
        }
        // Fallback to competitor text
        let textType = (i % 2 === 0) ? 'prep' : 'strategies';
        setNativeValue(textarea, getCompetitorText(textType, currentLessonName));
      }

      // 3. Fill text inputs — use AI homework or fallback
      const textInputs = getVisibleElements('input[type="text"]', lessonRoot).filter((field) => {
        return !field.closest("#CreateResourceForm") && !field.readOnly && !field.disabled;
      });
      for (const input of textInputs) {
        if ((input.value || "").trim()) continue;
        if (hasAI && aiData.homework && aiData.homework.trim()) {
          setNativeValue(input, aiData.homework);
          continue;
        }
        setNativeValue(input, getCompetitorText('prep', currentLessonName));
      }

      // 4. Fill contenteditable rich text fields
      const editables = getVisibleElements('[contenteditable="true"]', lessonRoot).filter((field) => !field.closest("#CreateResourceForm"));
      for (const editable of editables) {
        if ((editable.innerText || "").trim()) continue;
        editable.focus();
        var editableAIText = hasAI ? (aiData.closure || aiData.LectureClassCloseText || "") : "";
        if (editableAIText && editableAIText.trim()) {
          editable.innerText = editableAIText;
        } else {
          editable.innerText = getCompetitorText('strategies', currentLessonName);
        }
        triggerEvents(editable, ["input", "change", "blur"]);
      }
    }
    function findFinalSaveButtonSync(customSelector) {
      const exactTextButton = findPreferredElement({
        attributes: [
          customSelector || getCurrentSaveSelector(),
          'button[id="sub"]',
          'input[id="sub"]',
          'a[href="#finish"]',
          ".submit-form-btn",
          'button[type="submit"]',
          'input[type="submit"]',
          'button[onclick*="save"]',
          'input[onclick*="save"]'
        ],
        classes: [".btn.btn-primary.btn-main", "#sub", ".submit-form-btn", ".btn-main", ".btn-primary"],
        texts: ["\u062D\u0641\u0638 \u0648 \u0625\u0646\u0647\u0627\u0621", "\u062D\u0641\u0638 \u0648\u0625\u0646\u0647\u0627\u0621"]
      });
      if (exactTextButton) return exactTextButton;
      const genericSaveButton = findPreferredElement({
        attributes: [
          customSelector || getCurrentSaveSelector(),
          'button[id="sub"]',
          'input[id="sub"]',
          'a[href="#finish"]',
          ".submit-form-btn",
          'button[type="submit"]',
          'input[type="submit"]',
          'button[onclick*="save"]',
          'input[onclick*="save"]'
        ],
        classes: [".btn.btn-primary.btn-main", "#sub", ".submit-form-btn", ".btn-main", ".btn-primary"],
        texts: ["\u062D\u0641\u0638"]
      });
      if (!genericSaveButton) return null;
      const label = getElementLabel(genericSaveButton);
      if (label.includes("\u0639\u0648\u062F\u0629") || label.includes("\u0631\u062C\u0648\u0639") || label.includes("\u0627\u0644\u062A\u0627\u0644\u064A")) {
        return null;
      }
      return genericSaveButton;
    }
    async function findFinalSaveButton2() {
      const selectorProfile = await getSelectorProfile();
      return findFinalSaveButtonSync(selectorProfile.selector);
    }
    async function closeBlockingTourDialog() {
      const closeButton = findPreferredElement({
        ids: ["tg-dialog-close-btn"],
        attributes: ["#tg-dialog-close-btn", ".tg-dialog-close-btn"]
      });
      if (!closeButton) return false;
      activateElementOnce(closeButton);
      await sleep(300);
      return true;
    }
    async function acceptKnownConsentModal(options) {
      const modal = findPreferredElement({
        attributes: [options.modalSelector],
        classes: [options.modalSelector]
      });
      if (!modal || !isTrulyVisible(modal)) return false;
      const checkbox = modal.querySelector(options.checkboxSelector);
      if (checkbox) ensureCheckboxChecked(checkbox);
      if (options.confirmSelectors || options.confirmTexts) {
        const confirmButton = findPreferredElement({
          root: modal,
          attributes: options.confirmSelectors || [],
          classes: options.confirmClasses || [".btn-primary", ".btn-main"],
          texts: options.confirmTexts || []
        });
        if (confirmButton) {
          activateElementOnce(confirmButton);
        }
      }
      await sleep(options.waitAfter || 1200);
      return true;
    }
    async function handleAgreementModal() {
      if (await closeBlockingTourDialog()) return true;
      if (await acceptKnownConsentModal({
        modalSelector: "#behavior-modal",
        checkboxSelector: "#behavior-checkbox",
        confirmSelectors: [".cs-btn-behavior-modal"],
        confirmTexts: ["\u0627\u0648\u0627\u0641\u0642", "\u0623\u0648\u0627\u0641\u0642"],
        waitAfter: 1500
      })) return true;
      if (await acceptKnownConsentModal({
        modalSelector: "#privacy-notice-modal",
        checkboxSelector: "#privacy-notice-checkbox",
        confirmSelectors: [".cs-btn"],
        confirmTexts: ["\u0642\u0628\u0648\u0644"],
        waitAfter: 1500
      })) return true;
      if (await acceptKnownConsentModal({
        modalSelector: "#splashscreen",
        checkboxSelector: "#agreement",
        waitAfter: 2200
      })) return true;
      const label = findElementByText("label, div, span", "\u0645\u0648\u0627\u0641\u0642") || findElementByText("label, div, span", "\u0627\u0644\u062A\u0639\u0647\u062F") || findElementByText("label, div, span", "\u0623\u0642\u0631") || findElementByText("label, div, span", "\u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629");
      if (!label) return false;
      const modal = label.closest(".modal") || label.closest('[role="dialog"]');
      if (!modal) return false;
      let checkbox = null;
      try {
        checkbox = label.querySelector('input[type="checkbox"]');
      } catch {
        checkbox = null;
      }
      if (!checkbox) {
        const forAttr = label.getAttribute("for");
        if (forAttr) checkbox = document.getElementById(forAttr);
      }
      if (checkbox) ensureCheckboxChecked(checkbox);
      const confirmButton = findPreferredElement({
        root: modal,
        classes: [".btn-primary", ".btn-main"],
        texts: ["\u062A\u0623\u0643\u064A\u062F", "\u062D\u0641\u0638", "\u0645\u0648\u0627\u0641\u0642", "\u0627\u0648\u0627\u0641\u0642", "\u0623\u0648\u0627\u0641\u0642", "\u0642\u0628\u0648\u0644"]
      });
      if (!confirmButton) return Boolean(checkbox);
      activateElementOnce(confirmButton);
      await sleep(1200);
      return true;
    }
    async function waitForSaveCompletion(saveButton, timeoutMs = 3e4) {
      let activeSaveButton = saveButton;
      let attemptedRecovery = false;
      let submittedCurrentAttempt = false;
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (!submittedCurrentAttempt) {
          if (!document.contains(activeSaveButton) || !isTrulyVisible(activeSaveButton)) {
            const refreshedSaveButton = await findFinalSaveButton2();
            if (refreshedSaveButton && isTrulyVisible(refreshedSaveButton)) {
              activeSaveButton = refreshedSaveButton;
            } else if (detectPageState() !== FLOW_STATES.STEP2) {
              return buildResult(true, "Save button disappeared after page transition");
            } else {
              await sleep(600);
              continue;
            }
          }
          if (detectPageState() !== FLOW_STATES.STEP2) {
            return buildResult(true, "Page moved away from lesson form");
          }
          if (await handleAgreementModal()) {
            if (detectPageState() !== FLOW_STATES.STEP2) {
              return buildResult(true, "Agreement modal confirmed");
            }
          }
          if (!tryAcquireActionLock("final-save", FINAL_SAVE_LOCK_TTL_MS)) {
            return buildResult(true, "Final save was already submitted for this lesson");
          }
          await markFinalSaveSubmitted();
          activateElementOnce(activeSaveButton);
          lockActionElement(activeSaveButton);
          submittedCurrentAttempt = true;
          updateControlStatus("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0646\u0647\u0627\u0626\u064A. \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062A\u0623\u0643\u064A\u062F...", "info");
        }
        await sleep(1e3);
        if (detectPageState() !== FLOW_STATES.STEP2) {
          return buildResult(true, "Page moved away from lesson form after save");
        }
        const saveValidationError = findSaveValidationErrorMessage();
        if (saveValidationError) {
          await reopenAfterSaveValidationError();
          releaseActionLock("final-save");
          unlockActionElement(activeSaveButton);
          return buildResult(false, saveValidationError, { code: "save-validation-error" });
        }
        const duplicateLessonError = findDuplicateLessonErrorMessage();
        if (duplicateLessonError) {
          await reopenAfterSaveValidationError();
          releaseActionLock("final-save");
          unlockActionElement(activeSaveButton);
          return buildResult(false, duplicateLessonError, { code: "duplicate-lesson" });
        }
        const lessonRequirementError = findLessonRequirementErrorMessage();
        if (!lessonRequirementError) {
          continue;
        }
        if (!attemptedRecovery) {
          attemptedRecovery = true;
          await reopenAfterSaveValidationError();
          releaseActionLock("final-save");
          unlockActionElement(activeSaveButton);
          updateControlStatus("The site rejected the save because no lesson resource was linked. Recovering automatically...", "warning");
          await dismissLessonRequirementAlert();
          const recoveryResult = await ensureLessonRequirementSatisfied({
            skipEnrichment: true,
            ignoreInjectedResource: true,
            forceFallback: true
          });
          if (!recoveryResult.ok) {
            return buildResult(false, recoveryResult.message, { code: "missing-lesson-resource" });
          }
          await sleep(1e3);
          activeSaveButton = await findFinalSaveButton2() || activeSaveButton;
          submittedCurrentAttempt = false;
          continue;
        }
        return buildResult(false, lessonRequirementError, { code: "missing-lesson-resource" });
      }
      releaseActionLock("final-save");
      unlockActionElement(activeSaveButton);
      return buildResult(false, "Save timeout reached", { code: "save-timeout" });
    }
    async function runStep2Flow() {
      if (isSaving) {
        return buildResult(false, "A save action is already in progress", { code: "already-saving" });
      }
      isSaving = true;
      try {
        updatePrimaryButton("\u062C\u0627\u0631\u064A \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u062F\u0631\u0633...", "loading");
        updateControlStatus("\u062C\u0627\u0631\u064A \u062A\u0647\u064A\u0626\u0629 \u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u062D\u0636\u064A\u0631...", "info");

        // Step 2-A: Wait for React-rendered textareas to be fully hydrated
        await waitForElement('textarea', 15000);
        await sleep(1000); // Extra buffer for React hydration
        await closeBlockingTourDialog();

        // Step 2-B: Retrieve AI data stored by Phase 1
        const storageResult = await new Promise(function (resolve) {
          chrome.storage.local.get([AI_LESSON_DATA_KEY], resolve);
        });
        const aiData = storageResult[AI_LESSON_DATA_KEY] || null;
        _lastPreparedPayload = aiData;

        if (aiData) {
          console.log('[\u062A\u062D\u0636\u064A\u0631\u064A AI] Step 2 \u2014 AI data found:', JSON.stringify(aiData).substring(0, 200));
          updateControlStatus("\u062C\u0627\u0631\u064A \u062A\u0639\u0628\u0626\u0629 \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A...", "info");
          // fillLessonFields uses the updated setNativeValue, which targets the
          // HTMLTextAreaElement prototype setter so React registers the value.
          await fillLessonFields(aiData);
          await markLessonCheckboxes(aiData);
        } else {
          console.warn('[\u062A\u062D\u0636\u064A\u0631\u064A AI] No AI data found in storage, using fallback texts.');
          await fillLessonFields(null);
          await markLessonCheckboxes(null);
        }

        // Step 2-C: Satisfy the enrichment/activity requirement
        //           (must complete BEFORE the save click so tokens are in the DOM)
        updateControlStatus("\u062C\u0627\u0631\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0625\u062B\u0631\u0627\u0621/\u0627\u0644\u0648\u0627\u062C\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628...", "info");
        await ensureLessonRequirementSatisfied();

        // Crucial wait: allow any popup/modal to close and React to flush
        // enrichment-widget hidden tokens back into the main form DOM.
        console.log('[\u062A\u062D\u0636\u064A\u0631\u064A] Enrichment complete. Waiting 2s for DOM to settle...');
        await sleep(2000);

        // Step 2-D: Native Save — let Madrasati encrypt and submit
        //           We do NOT construct FormData or fetch ourselves; the platform's
        //           own submission handler performs the required payload encryption.
        updateControlStatus("\u062C\u0627\u0631\u064A \u062D\u0641\u0638 \u0627\u0644\u062F\u0631\u0633...", "loading");
        const saveButton = await findFinalSaveButton2();
        if (!saveButton) {
          throw new Error("\u0644\u0645 \u064A\u062A\u0645 \u0627\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u062D\u0641\u0638");
        }

        // Clear AI data BEFORE clicking so it is not re-used if the page
        // partially reloads and boot() fires again during the save round-trip.
        chrome.storage.local.remove(AI_LESSON_DATA_KEY);

        console.log('[\u062A\u062D\u0636\u064A\u0631\u064A] Clicking native save button — platform will encrypt and submit.');
        saveButton.click();

        updatePrimaryButton("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0644\u0644\u0645\u0646\u0635\u0629! \uD83D\uDE80", "success");
        updateControlStatus("\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062D\u0641\u0638 \u0644\u0644\u0645\u0646\u0635\u0629 \u0628\u0646\u062C\u0627\u062D.", "success");

        return buildResult(true, "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0628\u0646\u062C\u0627\u062D");

      } catch (error) {
        console.error('[\u062A\u062D\u0636\u064A\u0631\u064A] Step 2 Flow Error:', error);
        updateControlStatus("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062D\u0636\u064A\u0631", "error");
        return buildResult(false, error.message || "\u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639", { code: "step2-error" });
      } finally {
        isSaving = false;
      }
    }
    async function runQuickPrepStep2Flow() {
      // ── PARASITE STRATEGY ────────────────────────────────────────────────────
      // Fetches rich Arabic lesson content from k.Moeen-2.com via background.js,
      // decrypts both payloads, resolves the current lesson's named sections, and
      // injects the text directly into the Madrasati form fields.
      // Entirely replaces the old Madrasati internal API + template builder approach.
      if (isSaving) {
        return buildResult(false, "A save action is already in progress", { code: "already-saving" });
      }
      isSaving = true;
      try {
        log("runQuickPrepStep2Flow: START pathname=", window.location.pathname);
        updatePrimaryButton("جاري التحضير السريع...", "loading");
        updateControlStatus("جاري تهيئة صفحة التحضير...", "info");

        // Wait for React-rendered textareas
        await waitForElement("textarea", 15000);
        await sleep(1000);
        await closeBlockingTourDialog();

        // ── Restore IDs sequentially for React Hydration ─────────────────────────
        let subjectId = "", lessonId = "", tree2Value = "", tree3Value = "", tree5Value = "";
        try {
          const _raw = window.sessionStorage.getItem("Moeen-2_quick_ids");
          if (_raw) {
            const _ids = JSON.parse(_raw);
            subjectId = _ids.subjectId || "";
            lessonId = _ids.lessonId || "";
            tree2Value = _ids.tree2 || "";
            tree3Value = _ids.tree3 || "";
            tree5Value = _ids.tree5 || "";

            log("[Parasite] Restoring dropdowns sequentially...");
            const _domMap = {
              "SelectedUnitId": subjectId,
              "SelectedTrees_2": tree2Value,
              "SelectedTrees_3": tree3Value,
              "SelectedTrees_4": lessonId,
              "SelectedTrees_5": tree5Value
            };
            for (const [_id, _val] of Object.entries(_domMap)) {
              if (!_val) continue;
              const _el = document.getElementById(_id);
              if (_el) {
                setNativeValue(_el, _val);
                await sleep(500); // السطر ده هو اللي هيمنع React من مسح الاختيارات
                log("[Parasite] restored #" + _id + " =", _val);
              }
            }
          }
        } catch (_readErr) {
          log("SessionStorage read error", _readErr);
        }
        // ─────────────────────────────────────────────────────────────────────────

        log("runQuickPrepStep2Flow: subjectId=", subjectId, "lessonId=", lessonId);

        // Headless API Strategy: parasite/competitor decrypt chain has been retired.
        // Fall back to the standard field-fill pipeline; richer plan generation
        // is now handled out-of-band by background.js + silent POST.
        void subjectId; void lessonId; void tree2Value;
        await fillLessonFields(null);

        // Always fill any remaining required checkboxes
        await markLessonCheckboxes(null);

        // ── Step H — Enrichment & Save ────────────────────────────────────────────
        updateControlStatus("جاري إضافة الإثراء المطلوب...", "info");
        await ensureLessonRequirementSatisfied();

        // Allow enrichment DOM tokens to settle before save
        await sleep(2000);

        updateControlStatus("جاري حفظ الدرس...", "loading");
        log("runQuickPrepStep2Flow: about to call findFinalSaveButton2");
        const saveButton = await findFinalSaveButton2();
        log("runQuickPrepStep2Flow: findFinalSaveButton2 returned:",
          saveButton ? ("found, text=" + (saveButton.textContent || "").trim().substring(0, 40)) : "null");
        if (!saveButton) {
          throw new Error("لم يتم العثور على زر الحفظ");
        }

        const saveResult = await waitForSaveCompletion(saveButton);
        log("runQuickPrepStep2Flow: waitForSaveCompletion result:", saveResult);

        if (!saveResult.ok) {
          return saveResult;
        }

        updatePrimaryButton("تم إرسال التحضير للمنصة! ⚡", "success");
        updateControlStatus("تم التحضير السريع وحفظ الدرس بنجاح.", "success");
        return buildResult(true, "تم التحضير السريع بنجاح");

      } catch (error) {
        log("runQuickPrepStep2Flow error:", error);
        updateControlStatus("حدث خطأ أثناء التحضير السريع", "error");
        return buildResult(false, error.message || "خطأ غير متوقع", { code: "quick-step2-error" });
      } finally {
        isSaving = false;
      }
    }


    // src/content/index.js

    var step2CompletedThisSession = false;
    var sessionLocked = false;
    var isEnabled = false;
    var mutationObserver = null;
    function startMutationObserver() {
      if (mutationObserver || !document.body) return;
      mutationObserver = new MutationObserver(() => {
        if (!isEnabled || sessionLocked || AutomationController.running || AutomationController.starting || step2CompletedThisSession || AutomationController.state === FLOW_STATES.DONE || AutomationController.state === FLOW_STATES.ERROR || AutomationController.state === FLOW_STATES.IDLE || AutomationController.state === FLOW_STATES.DASHBOARD) return;
        const detectedState = detectPageState();
        if (AutomationController.state === FLOW_STATES.STEP2 && detectedState === FLOW_STATES.STEP2) {
          updateControlStatus("\u062A\u0645 \u0627\u0643\u062A\u0634\u0627\u0641 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062F\u0631\u0633. \u0627\u0633\u062A\u0626\u0646\u0627\u0641 \u0627\u0644\u062D\u0641\u0638...", "info");
          void AutomationController.run();
        }
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    var AutomationController = {
      state: FLOW_STATES.IDLE,
      starting: false,
      running: false,
      mode: "auto",
      async loadState() {
        const data = await getLocal([AUTOMATION_STATE_KEY, AUTOMATION_MODE_KEY, "storedPathKey"]);
        this.state = data[AUTOMATION_STATE_KEY] || FLOW_STATES.IDLE;
        this.mode = data[AUTOMATION_MODE_KEY] || "auto";
        return data;
      },
      async setState(nextState) {
        this.state = nextState;
        const update = { [AUTOMATION_STATE_KEY]: nextState, [AUTOMATION_MODE_KEY]: this.mode };
        if (nextState !== FLOW_STATES.IDLE) {
          update.storedPathKey = getAutomationActionKey("path-info");
        }
        await setLocal(update);
        if (nextState !== FLOW_STATES.DONE) {
          await clearSaveSubmittedMarker();
        }
      },
      async start(mode) {
        clearUiRemoval();
        if (this.starting || this.running) {
          updateControlStatus("\u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u064A\u0639\u0645\u0644 \u0628\u0627\u0644\u0641\u0639\u0644.", "info");
          return;
        }
        this.starting = true;
        try {
          this.mode = mode || "auto";
          isEnabled = true;
          const nextState = FLOW_STATES.STEP1;
          await this.setState(nextState);
          setButtonsDisabled(true);
          await sendAutomationStatus("START", { state: nextState, mode: this.mode });
          updateControlStatus("\u062A\u0645 \u0628\u062F\u0621 \u0627\u0644\u062A\u062D\u0636\u064A\u0631.", "info");
          void this.run();
        } finally {
          this.starting = false;
        }
      },
      async startAI() {
        clearUiRemoval();
        if (this.starting || this.running) {
          updateControlStatus("\u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u064A\u0639\u0645\u0644 \u0628\u0627\u0644\u0641\u0639\u0644.", "info");
          return;
        }
        this.starting = true;
        try {
          this.mode = "ai";
          isEnabled = true;
          setButtonsDisabled(true);

          // Update AI button with loading state
          var aiBtnEl = getAIButton();
          if (aiBtnEl) {
            var labelEl = aiBtnEl.querySelector(".Moeen-2-btn-label");
            if (labelEl) labelEl.textContent = "\u23F3 \u062C\u0627\u0631\u064A \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0645\u0646 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A...";
          }
          updateControlStatus("\u062C\u0627\u0631\u064A \u062C\u0645\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0631\u0633 \u0648\u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0644\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A...", "info");

          // 1. Scrape lesson context
          var context = scrapeLessonContext();
          _lastLessonContext = context;
          log("startAI: scraped context", context);
          console.log('[مُعين-2] Context scraped:', JSON.stringify(context));

          // 2. Fetch AI data from n8n — FIX 3: wrap in try/catch so a network
          //    failure doesn't crash the entire AI flow.
          updateControlStatus("\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A...", "info");
          var aiResult = null;
          try {
            aiResult = await fetchAILessonData(context);
            console.log('AI Data:', aiResult);
          } catch (fetchErr) {
            console.error('AI Flow Error:', fetchErr);
            aiResult = null;
          }

          if (aiResult) {
            // 3. Store AI data using explicit Promise to guarantee write completion
            await new Promise(function (resolve) {
              chrome.storage.local.set({ [AI_LESSON_DATA_KEY]: aiResult }, function () {
                console.log('[مُعين-2 AI] Saved to storage successfully.', aiResult);
                resolve();
              });
            });

            // 4. Verification read-back: confirm data is actually persisted
            var verification = await new Promise(function (resolve) {
              chrome.storage.local.get([AI_LESSON_DATA_KEY], function (result) {
                console.log('[مُعين-2 AI] Storage verification read-back:', result[AI_LESSON_DATA_KEY]);
                resolve(result[AI_LESSON_DATA_KEY]);
              });
            });

            if (verification) {
              console.log('[مُعين-2 AI] ✅ Data verified in storage. Proceeding to Step 1.');
              updateControlStatus("\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A. \u062C\u0627\u0631\u064A \u0628\u062F\u0621 \u0627\u0644\u062A\u062D\u0636\u064A\u0631...", "success");
            } else {
              console.warn('[مُعين-2 AI] ⚠️ Verification failed — data not found in storage after write!');
              updateControlStatus("\u062A\u062D\u0630\u064A\u0631: \u0644\u0645 \u064A\u062A\u0645 \u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A. \u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629.", "warning");
            }
          } else {
            console.warn('[مُعين-2 AI] AI fetch returned null, will fallback to competitor text');
            updateControlStatus("\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A. \u0633\u064A\u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629.", "warning");
            await sleep(1500);
          }

          // ── PHASE 1 COMPLETE ─────────────────────────────────────────────────────
          // Set state to STEP2 NOW (before navigating) so that:
          //   a) If the site performs a full page reload, boot() detects STEP2 and
          //      calls runStep2Flow() on the new page.
          //   b) If the site is an SPA, the MutationObserver detects the DOM change,
          //      sees state===STEP2, and calls runStep2Flow() automatically.
          // We do NOT call this.run() here — that would execute Phase 2 in the same
          // JS context as Phase 1 (the Step 1 page), which is the bug.
          await this.setState(FLOW_STATES.STEP2);
          await sendAutomationStatus("START", { state: FLOW_STATES.STEP2, mode: "ai" });
          console.log('[مُعين-2 AI] Phase 1 done. State set to STEP2. Clicking Next to navigate...');

          // Click the native Next button — this is the ONLY action in Phase 1.
          // runStep2Flow() will be triggered on the Step 2 page by the existing
          // MutationObserver or by boot() after page navigation.
          updateControlStatus("\u062C\u0627\u0631\u064A \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062F\u0631\u0633...", "info");
          const nextBtn = findNextButton();
          if (!nextBtn) {
            throw new Error("\u062A\u0639\u0630\u0631 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0632\u0631 \u0627\u0644\u062A\u0627\u0644\u064A");
          }
          activateElementOnce(nextBtn);
          // Phase 1 ends here. Do NOT proceed further in this context.

        } catch (err) {
          log("startAI error:", err);
          updateControlStatus("\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u0630\u0643\u064A: " + (err.message || err), "error");
          setButtonsDisabled(false);
          // Reset AI button label
          var aiBtnReset = getAIButton();
          if (aiBtnReset) {
            var resetLabel = aiBtnReset.querySelector(".Moeen-2-btn-label");
            if (resetLabel) resetLabel.textContent = "\uD83E\uDD16 \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u062F\u0631\u0633 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B";
          }
        } finally {
          this.starting = false;
        }
      },
      async startQuick() {
        clearUiRemoval();
        if (this.starting || this.running) {
          updateControlStatus("التحضير يعمل بالفعل.", "info");
          return;
        }
        this.starting = true;
        try {
          this.mode = "quick";
          isEnabled = true;
          const nextState = detectPageState() === FLOW_STATES.STEP2 ? FLOW_STATES.STEP2 : FLOW_STATES.STEP1;
          await this.setState(nextState);
          setButtonsDisabled(true);
          const quickBtnEl = getQuickButton();
          if (quickBtnEl) {
            const labelEl = quickBtnEl.querySelector(".Moeen-2-btn-label");
            if (labelEl) labelEl.textContent = "⏳ جاري التحضير السريع...";
          }
          await sendAutomationStatus("START", { state: nextState, mode: "quick" });
          updateControlStatus("تم بدء التحضير السريع.", "info");
          void this.run();
        } finally {
          this.starting = false;
        }
      },
      async stop(reason) {
        isEnabled = false;
        this.running = false;
        sessionLocked = false;
        resetSaving();
        await this.setState(FLOW_STATES.IDLE);
        await clearSaveSubmittedMarker();
        setButtonsDisabled(false);
        updatePrimaryButton(" \u0627\u0628\u062F\u0623 \u0627\u0644\u062A\u062D\u0636\u064A\u0631");
        updateControlStatus(reason || "\u062A\u0645 \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u062D\u0636\u064A\u0631.", "warning");
        await sendAutomationStatus("STOP", { state: FLOW_STATES.IDLE, reason: reason || "stopped" });
      },
      async finish(status, message) {
        const finalState = status === "DONE" ? FLOW_STATES.DONE : FLOW_STATES.ERROR;
        await this.setState(finalState);
        await clearSaveSubmittedMarker();
        isEnabled = false;
        this.running = false;
        setButtonsDisabled(false);
        updateControlStatus(message, status === "DONE" ? "success" : "error");
        updatePrimaryButton(
          status === "DONE" ? "\u062A\u0645 \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u062F\u0631\u0633" : "\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u0636\u064A\u0631",
          status === "DONE" ? "success" : "error"
        );
        await sendAutomationStatus(status, { state: finalState, message });
        await logPreparationToBackend(status, message);
        _lastPreparedPayload = null;
        _lastLessonContext = null;
        removeControlPanel(status === "DONE" ? 2500 : 5e3);
      },
      async run() {
        if (!isEnabled || this.running || sessionLocked) return;
        if (step2CompletedThisSession) {
          log("run() blocked: step2 already completed this session");
          return;
        }
        sessionLocked = true;
        this.running = true;
        try {
          if (this.state === FLOW_STATES.STEP1) {
            const step1Result = await runStep1Flow();
            if (!step1Result.ok) {
              if (step1Result.code === "duplicate-lesson") {
                await this.stop(step1Result.message || "\u064A\u0648\u062C\u062F \u062F\u0631\u0633 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u064B\u0627 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0639\u062F.");
                return;
              }
              throw new Error(step1Result.message);
            }
            if (this.mode === "step1Only") {
              await this.stop("\u062A\u0645 \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0627\u0631 \u0628\u0646\u062C\u0627\u062D.");
              return;
            }
            await this.setState(FLOW_STATES.STEP2);
            const duplicateOrTransitioned = await waitForValue(() => {
              const duplicateLessonError = findDuplicateLessonErrorMessage();
              if (duplicateLessonError) return { duplicateLessonError };
              return detectPageState() === FLOW_STATES.STEP2 ? { transitioned: true } : null;
            }, 22e3, 250);
            if (duplicateOrTransitioned?.duplicateLessonError) {
              releaseActionLock("step1-next");
              unlockActionElement(findNextButton());
              await this.stop(duplicateOrTransitioned.duplicateLessonError);
              return;
            }
            const transitioned = Boolean(duplicateOrTransitioned?.transitioned);
            if (!transitioned) {
              throw new Error("\u0644\u0645 \u064A\u0638\u0647\u0631 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u062F\u0631\u0633 \u0628\u0639\u062F \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u0623\u0648\u0644\u0649");
            }
          }
          if (this.state === FLOW_STATES.STEP2) {
            step2CompletedThisSession = true;
            const step2Result = this.mode === "quick"
              ? await runQuickPrepStep2Flow()
              : await runStep2Flow();
            if (!step2Result.ok) {
              if (step2Result.code === "duplicate-lesson") {
                await this.stop(step2Result.message || "A lesson is already registered for this timetable slot.");
                return;
              }
              throw new Error(step2Result.message);
            }
          }
          await this.finish("DONE", "\u062A\u0645 \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u062F\u0631\u0633 \u0648\u062D\u0641\u0638\u0647 \u0628\u0646\u062C\u0627\u062D.");
        } catch (error) {
          log("Automation failed:", error);
          step2CompletedThisSession = false;
          sessionLocked = false;
          await this.finish("ERROR", error.message || "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062D\u0636\u064A\u0631");
        } finally {
          this.running = false;
        }
      }
    };
    setControlPanelHandlers({
      start: (mode) => AutomationController.start(mode),
      startAI: () => AutomationController.startAI(),
      startQuick: () => AutomationController.startQuick()
    });
    setFinalSaveButtonDetector(findFinalSaveButtonSync);
    if (isContextAlive()) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.action === "EXTRACT_COOKIES") {
          try {
            const cookies = document.cookie;
            const schoolMatch = window.location.href.match(/[?&](?:SchoolId|schoolId|real_school_id)=([a-f0-9]{32})/i);
            let schoolId = schoolMatch ? schoolMatch[1] : "";
            if (!schoolId) {
              const schoolEl = document.querySelector('[href*="SchoolId="], [src*="SchoolId="]');
              if (schoolEl) {
                const match = (schoolEl.getAttribute('href') || schoolEl.getAttribute('src')).match(/SchoolId=([a-f0-9]{32})/i);
                if (match) schoolId = match[1];
              }
            }
            sendResponse({
              success: true,
              session_cookie: cookies,
              madrasati_school_id: schoolId
            });
          } catch (e) {
            sendResponse({ success: false, error: e.message });
          }
          return true;
        }

        if (!message || !message.type) return;
        if (message.type === "START") {
          sendResponse({ success: false, disabled: true });
          return true;
        }
        if (message.type === "STOP") {
          void AutomationController.stop("Stopped from extension controls").then(() => {
            removeControlPanel();
            sendResponse({ success: true, state: AutomationController.state });
          });
          return true;
        }
      });
    }
    // ── Auth gate: block all features until teacher logs in ──────────────
    function isHadarWorkflowPath() {
      return /\/SchoolSchedule(?:\/|$)|\/Teacher\/(?:LessonPreparation|Preparation|Lessons)(?:\/|$)/i.test(window.location.pathname);
    }

    async function checkAuthAndBoot() {
      const AUTH_SESSION_KEY = (globalThis.Moeen2_CONFIG && globalThis.Moeen2_CONFIG.AUTH_SESSION_KEY) || 'HADAR_AUTH';
      return new Promise((resolve) => {
        try {
          chrome.storage.local.get(AUTH_SESSION_KEY, (data) => {
            const session = data[AUTH_SESSION_KEY];
            if (session && session.isAuthenticated && session.token) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } catch (e) {
          resolve(false);
        }
      });
    }

    injectPresenceBadge("checking");
    checkAuthAndBoot().then(isLoggedIn => {
      if (!isLoggedIn) {
        injectPresenceBadge("login");
        // Keep the prominent login reminder only on pages where حضر can act.
        if (isTopLevelPage() && isHadarWorkflowPath() && !document.getElementById('hadar-auth-banner')) {
          const banner = document.createElement('div');
          banner.id = 'hadar-auth-banner';
          banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:linear-gradient(135deg,#0056b3,#1676df);color:#fff;text-align:center;padding:12px 16px;font-family:system-ui,sans-serif;font-size:14px;direction:rtl;box-shadow:0 2px 12px rgba(0,86,179,0.3);';
          banner.innerHTML = '🔒 <strong>حضر</strong> — يرجى تسجيل الدخول من أيقونة الامتداد لتفعيل الامتداد';
          document.body && document.body.prepend ? document.body.prepend(banner) : (document.body ? document.body.insertBefore(banner, document.body.firstChild) : null);
        }
        return; // Stop all automation
      }
      // ── Authenticated: run boot ──
      // Fix #2: Check subscription/quota BEFORE starting any automation
      (async function boot() {
        // 1. Fail closed: preparation cannot start without a verified active
        // trial or paid plan. Network/API failures are also blocked.
        var subscriptionAccess = await checkCurrentSubscriptionAccess();
        if (!subscriptionAccess.ok) {
          showSubscriptionAccessException(subscriptionAccess);
          return; // Stop all automation
        }

        // 3. Auto-push Madrasati session to Moeen web app if it's open
        if (isHadarWorkflowPath()) {
          try {
            const cookies = document.cookie;
            const schoolMatch = window.location.href.match(/[?&](?:SchoolId|schoolId|real_school_id)=([a-f0-9]{32})/i);
            let schoolId = schoolMatch ? schoolMatch[1] : "";
            if (!schoolId) {
              const schoolEl = document.querySelector('[href*="SchoolId="], [src*="SchoolId="]');
              if (schoolEl) {
                const match = (schoolEl.getAttribute('href') || schoolEl.getAttribute('src')).match(/SchoolId=([a-f0-9]{32})/i);
                if (match) schoolId = match[1];
              }
            }
            chrome.runtime.sendMessage({
              action: "PUSH_MADRASATI_SESSION",
              session_cookie: cookies,
              madrasati_school_id: schoolId
            }, () => void chrome.runtime.lastError);
          } catch (e) {
            console.warn("[Moeen Extension] Failed to auto-push session:", e);
          }
        }

        startScheduleRouteWatcher();
        if (BACKEND_PREPARATION_ENABLED && isHadarWorkflowPath()) {
          setTimeout(function () { void resumeBackendPreparationBatchIfNeeded(); }, 1500);
        }

        // Fix #1: Removed early return — boot now continues into full automation logic
        var bootPageState = detectPageState();

        // --- IFRAME AUTOMATION HOOK (for blue-lesson fallback) ---
        var isIframeMode = window.location.search.includes('Moeen-2_iframe') || window.name.includes('Moeen-2_iframe');

        if (isIframeMode) {
          // Persist the iframe marker across navigations within this subframe
          if (window.location.search.includes('Moeen-2_iframe') && !window.name.includes('Moeen-2_iframe')) {
            window.name = 'Moeen-2_iframe_master';
          }

          const originalFinish = AutomationController.finish;
          AutomationController.finish = async function (status, message) {
            await originalFinish.call(this, status, message);
            window.parent.postMessage({ type: 'Moeen-2_IFRAME_DONE', success: status === "DONE" }, '*');
          };

          if (bootPageState === FLOW_STATES.DASHBOARD) {
            // Either we landed here to click a blue cell, or we landed here AFTER a successful save
            // redirected back. The presence of `Moeen-2_click` in the URL tells us which case.
            var iframeParams = new URLSearchParams(window.location.search);
            var clickToken = iframeParams.get('Moeen-2_click');

            if (clickToken) {
              setTimeout(() => {
                var cellSelect = document.querySelector('.Moeen-2-dashboard-select[data-lesson-token="' + CSS.escape(clickToken) + '"]');
                var cellDiv = cellSelect ? (cellSelect.closest('div[data-data]') || cellSelect.parentElement) : null;
                var clickTarget = cellDiv && (cellDiv.querySelector('[onclick]') || cellDiv);

                if (!clickTarget) {
                  // Fallback: any element on the page carrying the token
                  clickTarget = document.querySelector('[data-lesson-token="' + CSS.escape(clickToken) + '"]');
                }

                if (clickTarget) {
                  try { clickTarget.click(); } catch (e) {
                    window.parent.postMessage({ type: 'Moeen-2_IFRAME_DONE', success: false }, '*');
                  }
                  // Madrasati's click handler should now navigate this subframe to ManageLecture.
                  // The boot hook will fire again on STEP1 and start the automation.
                } else {
                  console.error('[Moeen-2] iframe could not find cell for token', clickToken);
                  window.parent.postMessage({ type: 'Moeen-2_IFRAME_DONE', success: false }, '*');
                }
              }, 1500);
              return;
            }

            // No click instruction — assume we got here via post-save redirect (success)
            window.parent.postMessage({ type: 'Moeen-2_IFRAME_DONE', success: true }, '*');
            return;
          }

          if (bootPageState === FLOW_STATES.STEP1) {
            setTimeout(() => { AutomationController.start('auto'); }, 1000);
          }
        }
        // ---------------------------------------------------------

        if (bootPageState === FLOW_STATES.DASHBOARD && !isIframeMode) {
          injectDashboardUI();
          return;
        }

        startMutationObserver();

        if (!isContextAlive()) return;
        chrome.runtime.sendMessage({ type: "GET_RUNNING" }, async (response) => {
          if (chrome.runtime.lastError) return;
          isEnabled = !!(response && response.running);
          const data = await AutomationController.loadState();
          const terminalStates = [FLOW_STATES.DONE, FLOW_STATES.ERROR, FLOW_STATES.IDLE];

          // استئناف الحالة المحفوظة في حالة تحديث الصفحة أو الانتقال التلقائي
          if (AutomationController.state === FLOW_STATES.DONE || AutomationController.state === FLOW_STATES.ERROR) {
            const currentPathKey = getAutomationActionKey("path-info");
            if (currentPathKey !== data.storedPathKey) {
              AutomationController.state = FLOW_STATES.IDLE;
              return;
            }
            isEnabled = false;
            setButtonsDisabled(false);
            updatePrimaryButton(
              AutomationController.state === FLOW_STATES.DONE ? "تم تحضير الدرس" : "فشل التحضير",
              AutomationController.state === FLOW_STATES.DONE ? "success" : "error"
            );
            updateControlStatus("تم إنهاء التحضير مسبقاً. جاري مزامنة الحالة...", "info");
            await sendAutomationStatus(AutomationController.state === FLOW_STATES.DONE ? "DONE" : "ERROR", {
              state: AutomationController.state,
              message: "Stored automation state was already complete."
            });
            await clearSaveSubmittedMarker();
            return;
          }

          // استئناف الخطوة الثانية (Step 2) فور الوصول لصفحة النموذج
          if (AutomationController.state === FLOW_STATES.STEP2 && detectPageState() === FLOW_STATES.STEP2) {
            isEnabled = true;
            setButtonsDisabled(true);
            updatePrimaryButton("جاري الاستئناف...", "loading");
            updateControlStatus("تم اكتشاف نموذج الدرس. جاري تعبئة الحقول وحفظ الدرس...", "info");
            void AutomationController.run();
            return;
          }

          if (isEnabled && !terminalStates.includes(AutomationController.state)) {
            setButtonsDisabled(true);
            updatePrimaryButton("جاري الاستئناف...", "loading");
            updateControlStatus("يتم استئناف التحضير بعد تحديث الصفحة...", "info");
            void AutomationController.run();
          }
        });
      })();
    }); // end checkAuthAndBoot().then()
  })();
})();
