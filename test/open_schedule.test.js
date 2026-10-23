/* Exercises openMadrasatiSchedule in background.js: with no schedule tab, the
 * extension opens the teacher schedule itself, and a sign-in page comes back
 * as a clear error instead of a tab. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8').replace(/\r\n/g, '\n');
const START = 'async function findMadrasatiTab(';
const END = 'async function sendToTab(';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

function build(landingUrl) {
  const tabs = [];
  const created = [];
  const chrome = {
    tabs: {
      query: async () => tabs.slice(),
      create: async ({ url }) => {
        created.push(url);
        const tab = { id: 42, url: landingUrl, status: 'complete', active: true };
        tabs.push(tab);
        return tab;
      },
      get: async (id) => tabs.find((t) => t.id === id) || null,
      update: async () => null,
    },
  };
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < from) throw new Error('could not slice the tab helpers out of background.js');
  const factory = new Function('chrome', `${SOURCE.slice(from, to)}; return { openMadrasatiSchedule, findMadrasatiTab };`);
  return { ...factory(chrome), created };
}

(async () => {
  {
    const { openMadrasatiSchedule, created } = build('https://schools.madrasati.sa/SchoolSchedule/Schedule/TeacherSchedule?SchoolId=abc');
    const found = await openMadrasatiSchedule();
    check('the teacher schedule is opened', created[0] === 'https://schools.madrasati.sa/SchoolSchedule');
    check('and used for the preparation', found.tab && found.tab.id === 42 && !found.error);
  }
  {
    const { openMadrasatiSchedule } = build('https://schools.madrasati.sa/Account/Login?ReturnUrl=%2FSchoolSchedule');
    const found = await openMadrasatiSchedule();
    check('a sign-in page gives no tab', found.tab === null);
    check('and asks the teacher to sign in', /سجّل الدخول/.test(found.error));
  }
  console.log(failures ? `\n${failures} failed` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
