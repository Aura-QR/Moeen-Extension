/* «حفظ في فصولي»: reads a class's student names from Madrasati's «قائمة
 * الطلاب» page (/SchoolManagment/Actions/MyStudents) for Hader's saved
 * classes. Pure functions over a parsed Document, shared by the content
 * script and the tests.
 *
 * Only names and class labels are read. The cards also show e-mails and
 * statuses; those are never read or sent. */
(function initClassesImport(globalScope) {
  if (!globalScope) return;

  const MY_STUDENTS_PATH = /\/SchoolManagment\/Actions\/MyStudents/i;
  // Madrasati serves up to 21 cards a page; 80 is Hader's limit per class.
  const MAX_PAGES = 10;
  const MAX_NAMES = 80;

  function isMyStudentsPage(loc) {
    return MY_STUDENTS_PATH.test(String(loc && loc.pathname || ''));
  }

  /** School id from the page URL; the filter link uses "SchoolId", paging uses "schoolId". */
  function schoolIdFrom(href) {
    try {
      const params = new URL(href).searchParams;
      for (const [key, value] of params) {
        if (key.toLowerCase() === 'schoolid' && value) return value;
      }
    } catch (_) { }
    return null;
  }

  /** Classes offered by the page's «الفصل» filter: [{id, name}], without the empty option. */
  function classesFrom(doc) {
    const select = doc.querySelector('select#SearchClassRoom');
    if (!select) return [];
    return Array.from(select.options)
      .map((option) => ({ id: String(option.value || '').trim(), name: cleanText(option.textContent) }))
      .filter((item) => item.id && item.name && !/^(الكل|اختر|--)/.test(item.name));
  }

  /** Student names on one page, in page order. */
  function namesFrom(doc) {
    return Array.from(doc.querySelectorAll('#studentsDiv .card-title'))
      .map((node) => cleanText(node.textContent))
      .filter(Boolean);
  }

  /** Highest page number linked from the pager (1 when there is no pager). */
  function lastPageFrom(doc) {
    let last = 1;
    doc.querySelectorAll('.pagination a[href]').forEach((link) => {
      const match = String(link.getAttribute('href')).match(/[?&]PageNumber=(\d+)/i);
      if (match) last = Math.max(last, Number(match[1]));
    });
    return Math.min(last, MAX_PAGES);
  }

  /** URL of one page of one class. Paging keeps the class filter (checked on Madrasati, 2026-10-23). */
  function pageUrl(origin, schoolId, classId, page) {
    const params = new URLSearchParams({ PageNumber: String(page), schoolId: schoolId, searchClassRoom: classId });
    return `${origin}/SchoolManagment/Actions/MyStudents?${params.toString()}`;
  }

  /**
   * All names of one class. fetchDoc(url) returns a parsed Document.
   * Stops at the pager's last page, an empty page, or a page identical to
   * the previous one (some servers repeat the last page).
   */
  async function readClass(fetchDoc, origin, schoolId, classId) {
    const names = [];
    let previous = null;
    let last = 1;
    for (let page = 1; page <= last && page <= MAX_PAGES; page++) {
      const doc = await fetchDoc(pageUrl(origin, schoolId, classId, page));
      if (page === 1) last = lastPageFrom(doc);
      const pageNames = namesFrom(doc);
      const key = pageNames.join('|');
      if (!pageNames.length || key === previous) break;
      previous = key;
      names.push(...pageNames);
      if (names.length >= MAX_NAMES) break;
    }
    return names.slice(0, MAX_NAMES);
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  globalScope.HaderClassesImport = Object.freeze({
    isMyStudentsPage, schoolIdFrom, classesFrom, namesFrom, lastPageFrom, pageUrl, readClass, MAX_NAMES,
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
