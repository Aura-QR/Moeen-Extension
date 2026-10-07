/* Exercises readMadrasatiUser, which tells حضّر which Madrasati teacher is
 * signed in so each Hader account stays linked to one teacher.
 *
 * The function is sliced out of content.js and run against a fake document.
 * The script fixture is copied from a real Madrasati timetable page; inside a
 * <script> the "&amp;" is not decoded, so the reader must see past it. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8').replace(/\r\n/g, '\n');
const START = '    // The Madrasati teacher signed in to this page.';
const END = '    function haderExtractSchoolId(';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

const MENU_SCRIPT = `
        ],
        user: {
            image: "https://vstedu.azureedge.net/v27/assets/images/profile-default.png?v=14",
            name: "شروق عايد العصيمي",
            school: "معلم",

            sub: [
                {
                    label: "ملف الإنجاز",
                    url: "/TeacherProfile/My?schoolId=6E91EFB432214026DFC80BC935F660B6&amp;userId=F10A5C95735D01C3AC1FAAFB6F66AA30",
                    visible: "True",
                    icon: "fa-solid fa-wallet",
                }, {
                    label: "تعديل بياناتي",
                    url: "/SystemUser/Home/UpdateMyInformation",`;

function loadReader({ anchors = [], scripts = [] }) {
  const start = SOURCE.indexOf(START);
  const end = SOURCE.indexOf(END, start);
  if (start === -1 || end === -1) throw new Error('readMadrasatiUser block not found in content.js');
  const document = {
    querySelectorAll(selector) {
      if (selector === 'a[href*="userId="]') {
        return anchors.map((href) => ({ getAttribute: () => href }));
      }
      if (selector === 'script:not([src])') {
        return scripts.map((text) => ({ textContent: text }));
      }
      return [];
    }
  };
  return new Function('document', SOURCE.slice(start, end) + '\nreturn readMadrasatiUser;')(document);
}

{
  const read = loadReader({ scripts: ['var unrelated = 1;', MENU_SCRIPT] });
  const user = read();
  check('reads the userId from the menu script', user.madrasati_user_id === 'F10A5C95735D01C3AC1FAAFB6F66AA30');
  check('reads the teacher name from the same script', user.madrasati_user_name === 'شروق عايد العصيمي');
}

{
  const read = loadReader({
    anchors: ['/TeacherProfile/My?schoolId=6E91EFB432214026DFC80BC935F660B6&userId=0123456789abcdef0123456789abcdef']
  });
  const user = read();
  check('reads the userId from a profile link and uppercases it', user.madrasati_user_id === '0123456789ABCDEF0123456789ABCDEF');
  check('leaves the name empty when the page has none', user.madrasati_user_name === null);
}

{
  const read = loadReader({
    anchors: ['/Students/Profile?userId=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
    scripts: ['openProfile("/Teacher/View?userId=BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")']
  });
  check('ignores userIds that are not the signed-in teacher\'s own profile', read().madrasati_user_id === null);
}

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll readMadrasatiUser checks passed');
