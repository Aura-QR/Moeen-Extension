/* Exercises shared/classes_import_core.js against pages shaped like
 * Madrasati's «قائمة الطلاب» (MyStudents), as inspected on 2026-10-23.
 * Needs jsdom; it is taken from this repo or the sibling website repo. */
const path = require('path');

let JSDOM;
try {
  ({ JSDOM } = require(require.resolve('jsdom', { paths: [__dirname, path.join(__dirname, '..', '..', 'moeen_front')] })));
} catch (_) {
  console.log('- skipped: jsdom is not installed');
  process.exit(0);
}

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

global.globalThis.HaderClassesImport = undefined;
require(path.join(__dirname, '..', 'shared', 'classes_import_core.js'));
const core = globalThis.HaderClassesImport;

function card(name) {
  return `<div class="col-sm mb-3"><div class="card p-3"><div class="card-body">
    <h5 class="card-title text-black-2 fw-bold mb-2">  ${name}  </h5>
    <ul class="list-unstyled"><li><h6>اسم الفصل : <span>اولى</span></h6></li>
    <li><h6>الإيميل : <span>secret@example.com</span></h6></li></ul></div></div></div>`;
}

function page(names, lastPage) {
  const pager = lastPage > 1
    ? `<ul class="pagination">${Array.from({ length: lastPage }, (_, i) => `<li><a class="page-link" href="/SchoolManagment/Actions/MyStudents?PageNumber=${i + 1}&schoolId=S1&searchClassRoom=215002">${i + 1}</a></li>`).join('')}</ul>`
    : '';
  return `<html><body>
    <select id="SearchClassRoom"><option value="">الكل</option><option value="215002">اولى</option><option value="215007">خامس</option></select>
    <div id="studentsDiv">${names.map(card).join('')}</div>${pager}</body></html>`;
}

const doc = (html) => new JSDOM(html).window.document;

(async () => {
  const first = doc(page(['طالب 1', 'طالب 2'], 2));
  check('reads the classes without the «الكل» option', JSON.stringify(core.classesFrom(first)) === JSON.stringify([{ id: '215002', name: 'اولى' }, { id: '215007', name: 'خامس' }]));
  check('reads only the names, trimmed', JSON.stringify(core.namesFrom(first)) === JSON.stringify(['طالب 1', 'طالب 2']));
  check('finds the last page from the pager', core.lastPageFrom(first) === 2);
  check('school id from either spelling', core.schoolIdFrom('https://x/MyStudents?SchoolId=AB12') === 'AB12' && core.schoolIdFrom('https://x/MyStudents?PageNumber=2&schoolId=CD') === 'CD');
  check('page URL keeps the class filter', core.pageUrl('https://schools.madrasati.sa', 'S1', '215002', 2) === 'https://schools.madrasati.sa/SchoolManagment/Actions/MyStudents?PageNumber=2&schoolId=S1&searchClassRoom=215002');
  check('recognises the page', core.isMyStudentsPage({ pathname: '/SchoolManagment/Actions/MyStudents' }) && !core.isMyStudentsPage({ pathname: '/SchoolSchedule' }));

  // 27 students over two pages (21 + 6), like the real «اولى».
  const all = Array.from({ length: 27 }, (_, i) => `طالب ${i + 1}`);
  const requested = [];
  const names = await core.readClass(async (url) => {
    requested.push(url);
    const n = Number(new URL(url).searchParams.get('PageNumber'));
    return doc(page(all.slice((n - 1) * 21, n * 21), 2));
  }, 'https://schools.madrasati.sa', 'S1', '215002');
  check('reads every page of a class', names.length === 27 && names[26] === 'طالب 27');
  check('asks only for the pages that exist', requested.length === 2);

  // A server that repeats its last page forever stops after one repeat.
  let calls = 0;
  const repeated = await core.readClass(async () => { calls++; return doc(page(['أ', 'ب'], 9)); }, 'https://x', 'S', 'C');
  check('stops when a page repeats', repeated.length === 2 && calls === 2);

  check('never reads e-mails', !JSON.stringify(names).includes('@'));

  if (failures) {
    console.log(`\n${failures} check(s) failed`);
    process.exit(1);
  }
})();
