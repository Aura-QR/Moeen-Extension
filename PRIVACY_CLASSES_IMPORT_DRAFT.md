# Draft: privacy changes for «حفظ في فصولي» (extension)

The feature reads student **names** from Madrasati's «قائمة الطلاب» page and saves them to the teacher's «فصولي» in Hader. It ships switched off (`FEATURES.CLASSES_IMPORT` in `shared/constants.js`). Before switching it on:

1. The owner approves and publishes the texts below: the extension privacy policy, and the website policy (`moeen-backend/docs/PRIVACY_CLASSES_DRAFT.md`).
2. The Chrome Web Store listing's privacy section is updated (section 3).
3. A new version is uploaded.

---

## 1. What the feature does (for the owner)
- Runs only on `schools.madrasati.sa/SchoolManagment/Actions/MyStudents` («قائمة الطلاب»), and only when the teacher presses the button.
- **Reads:** the class names in the page's class filter, and the student names on the cards (all pages of the chosen classes), using the teacher's own Madrasati session. It only opens pages (GET); it never changes anything on Madrasati.
- **Does not read:** e-mails, student status, IDs, phones, parents' data, grades. Those appear on the page but aren't read.
- **Sends:** class name + list of names, to `api.haderedu.com` (`/classes`), into the teacher's own account. The teacher sees the list before saving.
- **Stores nothing in the extension** (no names in `chrome.storage`).

## 2. Text for the extension privacy policy (new section, Arabic)

### حفظ أسماء طلابك في «فصولي» (اختياري)
- عند ضغطك زر «حفظ الفصول في فصولي» في صفحة «قائمة الطلاب» بمنصة مدرستي، تقرأ الإضافة **أسماء الطلاب وأسماء الفصول فقط** من الصفحة، وتعرضها عليك للمراجعة قبل الحفظ.
- لا تقرأ الإضافة البريد الإلكتروني أو أرقام الهوية أو أرقام الجوال أو بيانات أولياء الأمور أو الدرجات، ولا تغيّر أي بيانات في منصة مدرستي.
- تُرسل الأسماء إلى حسابك في منصة حضّر فقط، لاستخدامها في أدواتك (مثل الخطط والشهادات)، ولا تُحفظ داخل الإضافة.
- لا تُرسل هذه الأسماء إلى خدمات الذكاء الاصطناعي، ولا نشاركها مع أي جهة.
- يمكنك حذف أي فصل وأسمائه من «فصولي» في أي وقت، ويُحذف نهائيًا.
- الميزة لا تعمل إلا بضغطك الزر بنفسك.

## 3. Chrome Web Store: Privacy practices tab
- **Data usage → "Personally identifiable information": check it.** In the description, say that it is student names, read from Madrasati only when the teacher presses the button and saved to the teacher's Hader account.
- **Certifications:** keep all three:
  - not sold to third parties;
  - not used for purposes unrelated to the item's single purpose;
  - not used for creditworthiness or lending.
- **Single purpose description:** add «وحفظ قوائم أسماء الطلاب في حساب المعلم في حضّر».
- **Permissions:** none new. It uses the existing `schools.madrasati.sa` host permission.
