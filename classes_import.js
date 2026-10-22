/* «حفظ في فصولي» on Madrasati's «قائمة الطلاب» page.
 *
 * The teacher picks classes, the names are read from every page of each
 * class (GET requests with the teacher's own Madrasati session, nothing is
 * changed on Madrasati), shown for review, and saved to Hader's «فصولي»
 * through the background worker. Only names leave the page.
 *
 * Off unless Moeen2_CONFIG.FEATURES.CLASSES_IMPORT is true: it may ship only
 * after the privacy policy covers student names. */
(function haderClassesImport() {
  const config = globalThis.Moeen2_CONFIG || {};
  const core = globalThis.HaderClassesImport;
  if (!core || !config.FEATURES || !config.FEATURES.CLASSES_IMPORT) return;
  if (window.top !== window || !core.isMyStudentsPage(location)) return;
  if (document.getElementById('hader-classes-btn')) return;

  const STYLE = `
    #hader-classes-btn { position: fixed; bottom: 24px; left: 24px; z-index: 99999; background: #0F766E; color: #fff;
      border: 0; border-radius: 999px; padding: 12px 20px; font: 700 15px/1.2 inherit; box-shadow: 0 6px 18px rgba(0,0,0,.18); cursor: pointer; }
    #hader-classes-overlay { position: fixed; inset: 0; z-index: 100000; background: rgba(15,23,42,.45); display: flex; align-items: center; justify-content: center; }
    #hader-classes-modal { direction: rtl; background: #fff; width: min(520px, 92vw); max-height: 86vh; overflow: auto; border-radius: 16px;
      padding: 20px 22px; font: 14px/1.7 inherit; color: #1f2937; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
    #hader-classes-modal h3 { margin: 0 0 6px; font-size: 18px; color: #0F766E; }
    #hader-classes-modal .hint { color: #6b7280; font-size: 13px; margin-bottom: 12px; }
    #hader-classes-modal label.row { display: flex; gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 10px; margin-bottom: 8px; }
    #hader-classes-modal .count { margin-inline-start: auto; color: #6b7280; font-size: 13px; }
    #hader-classes-modal details { margin: -4px 0 10px; padding: 0 12px; font-size: 13px; color: #4b5563; }
    #hader-classes-modal .actions { display: flex; gap: 10px; justify-content: flex-start; margin-top: 14px; }
    #hader-classes-modal button { border-radius: 10px; padding: 9px 18px; font: 700 14px inherit; cursor: pointer; border: 1px solid #0F766E; }
    #hader-classes-modal button.primary { background: #0F766E; color: #fff; }
    #hader-classes-modal button.secondary { background: #fff; color: #0F766E; }
    #hader-classes-modal button[disabled] { opacity: .5; cursor: default; }
    #hader-classes-modal .msg { margin-top: 10px; font-weight: 700; }
    #hader-classes-modal .msg.error { color: #b91c1c; }
    #hader-classes-modal .msg.ok { color: #047857; }
  `;

  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'hader-classes-btn';
  button.type = 'button';
  button.textContent = 'حفظ الفصول في «فصولي» – حضّر';
  button.addEventListener('click', openModal);
  document.body.appendChild(button);

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === 'className') node.className = value;
      else node.setAttribute(key, value);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function closeModal() {
    const overlay = document.getElementById('hader-classes-overlay');
    if (overlay) overlay.remove();
  }

  async function fetchDoc(url) {
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return new DOMParser().parseFromString(await response.text(), 'text/html');
  }

  function openModal() {
    closeModal();
    const classes = core.classesFrom(document);
    const schoolId = core.schoolIdFrom(location.href);

    const overlay = el('div', { id: 'hader-classes-overlay' });
    overlay.addEventListener('click', (event) => { if (event.target === overlay) closeModal(); });
    const modal = el('div', { id: 'hader-classes-modal', role: 'dialog', 'aria-modal': 'true' });
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.appendChild(el('h3', {}, 'حفظ الفصول في «فصولي»'));
    modal.appendChild(el('div', { className: 'hint' },
      'اختر الفصول، ثم راجع الأسماء قبل الحفظ. نحفظ أسماء الطلاب فقط في حسابك على حضّر، ولا نغيّر شيئًا في منصة مدرستي.'));

    const message = el('div', { className: 'msg' });
    if (!schoolId || !classes.length) {
      message.classList.add('error');
      message.textContent = 'لم نجد قائمة الفصول في هذه الصفحة. افتح «قائمة الطلاب» من القائمة العلوية ثم حاول مرة أخرى.';
      modal.appendChild(message);
      const actions = el('div', { className: 'actions' });
      const close = el('button', { type: 'button', className: 'secondary' }, 'إغلاق');
      close.addEventListener('click', closeModal);
      actions.appendChild(close);
      modal.appendChild(actions);
      return;
    }

    const rows = classes.map((item) => {
      const row = el('label', { className: 'row' });
      const box = el('input', { type: 'checkbox' });
      box.checked = true;
      const count = el('span', { className: 'count' }, '');
      row.append(box, el('span', {}, item.name), count);
      modal.appendChild(row);
      const details = el('details');
      details.hidden = true;
      modal.appendChild(details);
      return { item, box, count, details, names: null };
    });

    modal.appendChild(message);
    const actions = el('div', { className: 'actions' });
    const read = el('button', { type: 'button', className: 'primary' }, 'قراءة الأسماء');
    const save = el('button', { type: 'button', className: 'primary' }, 'حفظ في فصولي');
    save.hidden = true;
    const cancel = el('button', { type: 'button', className: 'secondary' }, 'إلغاء');
    cancel.addEventListener('click', closeModal);
    actions.append(read, save, cancel);
    modal.appendChild(actions);

    read.addEventListener('click', async () => {
      const chosen = rows.filter((row) => row.box.checked);
      if (!chosen.length) return;
      read.disabled = true;
      message.className = 'msg';
      try {
        for (const row of chosen) {
          row.count.textContent = 'جاري القراءة…';
          row.names = await core.readClass(fetchDoc, location.origin, schoolId, row.item.id);
          row.count.textContent = `${row.names.length} طالب`;
          row.details.hidden = !row.names.length;
          row.details.replaceChildren(el('summary', {}, 'عرض الأسماء'), el('div', {}, row.names.join('، ')));
        }
        rows.forEach((row) => { row.box.disabled = true; });
        read.hidden = true;
        save.hidden = false;
        message.textContent = 'راجع الأعداد ثم اضغط «حفظ في فصولي». الفصل الموجود بنفس الاسم في حضّر تُستبدل أسماؤه.';
      } catch (error) {
        read.disabled = false;
        message.classList.add('error');
        message.textContent = 'تعذر قراءة الأسماء من مدرستي. حدّث الصفحة وحاول مرة أخرى.';
      }
    });

    save.addEventListener('click', async () => {
      const classesToSave = rows
        .filter((row) => row.box.checked && row.names && row.names.length)
        .map((row) => ({ name: row.item.name, students: row.names }));
      if (!classesToSave.length) {
        message.className = 'msg error';
        message.textContent = 'لا توجد أسماء للحفظ.';
        return;
      }
      save.disabled = true;
      message.className = 'msg';
      message.textContent = 'جاري الحفظ…';
      const result = await chrome.runtime.sendMessage({ action: 'HADER_SAVE_CLASSES', classes: classesToSave })
        .catch(() => ({ success: false }));
      if (result && result.success) {
        message.className = 'msg ok';
        message.textContent = `تم حفظ ${result.saved} فصل في «فصولي». تجدها في حضّر على الموقع والتطبيق.`;
        save.hidden = true;
        cancel.textContent = 'إغلاق';
      } else {
        save.disabled = false;
        message.className = 'msg error';
        message.textContent = result && result.code === 'not_signed_in'
          ? 'سجّل الدخول في حضّر أولًا، ثم حاول مرة أخرى.'
          : (result && result.message) || 'تعذر الحفظ في حضّر، حاول مرة أخرى.';
      }
    });
  }
})();
