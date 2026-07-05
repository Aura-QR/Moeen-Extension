const fs = require('fs');

try {
    const code = fs.readFileSync('here.js', 'utf8');
    console.log("⏳ جاري البحث عن المفاتيح في الكود...\n");

    // 1. البحث عن الاستدعاءات المتتالية زي: a(e, 13); a(e, 4);
    const regex = /([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\s*,\s*(0x[0-9a-fA-F]+|\d+)\)/g;
    let match;
    const calls = [];
    while ((match = regex.exec(code)) !== null) {
        calls.push({
            func: match[1],
            var: match[2],
            val: parseInt(match[3], match[3].startsWith('0x') ? 16 : 10)
        });
    }

    let results = [];
    for (let i = 0; i < calls.length - 1; i++) {
        if (calls[i].func === calls[i + 1].func && calls[i].var === calls[i + 1].var) {
            let seq = [calls[i].val];
            let j = i + 1;
            while (j < calls.length && calls[j].func === calls[i].func && calls[j].var === calls[i].var) {
                seq.push(calls[j].val);
                j++;
            }
            if (seq.length >= 3) {
                results.push({ func: calls[i].func, var: calls[i].var, seq: seq });
            }
            i = j - 1;
        }
    }

    if (results.length > 0) {
        console.log("🎯 طريقة الاستدعاء المتتالي:");
        results.forEach(r => {
            // أرقام الخلطة دايماً بتكون صغيرة (أقل من 30)
            if (r.seq.every(n => n > 0 && n <= 30)) {
                console.log(`الدالة [ ${r.func} ] طبقت الأرقام دي: [ ${r.seq.join(', ')} ]`);
            }
        });
    }

    // 2. البحث عن مصفوفات أرقام مباشرة لو غيروا الطريقة لـ Array
    const arrayRegex = /\[((?:0x[0-9a-fA-F]+|\d+)\s*,\s*){3,}(?:0x[0-9a-fA-F]+|\d+)\]/g;
    const arrays = code.match(arrayRegex);
    if (arrays) {
        console.log("\n📌 مصفوفات أرقام محتملة:");
        arrays.forEach(arr => {
            let cleaned = arr.replace(/\[|\]|\s/g, '').split(',').map(n => parseInt(n, n.startsWith('0x') ? 16 : 10));
            if (cleaned.every(n => n > 0 && n <= 30)) {
                console.log(`[ ${cleaned.join(', ')} ]`);
            }
        });
    }

} catch (e) {
    console.error("❌ حدث خطأ:", e.message);
}