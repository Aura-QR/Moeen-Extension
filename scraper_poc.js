const fs = require('fs');

// معادلة التتبع العكسي لمسار الحروف
function reverseIndex(i, K, L) {
    const chunkStart = Math.floor(i / K) * K;
    const chunkLen = Math.min(K, L - chunkStart);
    const chunkOffset = i - chunkStart;
    return chunkStart + chunkLen - 1 - chunkOffset;
}

function chunkReverse(str, chunkSize) {
    if (!str) return '';
    const chunks = str.match(new RegExp('.{1,' + chunkSize + '}', 'g')) || [];
    return chunks.map(c => c.split('').reverse().join('')).join('');
}

async function fetchAndCrack() {
    console.log("⏳ جاري سحب الأسئلة وكسر التشفير بالبحث العكسي (Reverse Indexing)...");
    try {
        const response = await fetch("https://q.tahdiri.com/q/qq.php?a=MzU%3DNQ%3Dy", {
            headers: {
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
                "Origin": "https://t.tahdiri.com",
                "Referer": "https://t.tahdiri.com/"
            }
        });

        const encryptedText = await response.text();
        const s = encryptedText.trim();
        const L = s.length;

        console.log(`ℹ️ طول النص المتشفر: ${L}`);

        // بناء الاحتمالات (تتضمن أرقام الـ URL وأطوال الخلطات الممكنة)
        let seqs = [];
        seqs.push([35]); seqs.push([5]); seqs.push([35, 5]);
        seqs.push([9, 8, 7, 6, 5]); seqs.push([7, 2, 5, 4]); seqs.push([11, 2, 3, 4]); seqs.push([2, 2, 3, 3]);

        // توليد كل المصفوفات الممكنة لحد 4 أرقام
        for (let i = 2; i <= 15; i++) seqs.push([i]);
        for (let i = 2; i <= 12; i++) for (let j = 2; j <= 12; j++) seqs.push([i, j]);
        for (let i = 2; i <= 10; i++) for (let j = 2; j <= 10; j++) for (let k = 2; k <= 10; k++) seqs.push([i, j, k]);
        for (let i = 2; i <= 8; i++) for (let j = 2; j <= 8; j++) for (let k = 2; k <= 8; k++) for (let l = 2; l <= 8; l++) seqs.push([i, j, k, l]);

        console.log(`🔍 جاري فحص ${seqs.length * seqs.length} احتمال تشفير في ثانية واحدة...`);

        let found = null;
        for (let seq1 of seqs) {
            for (let seq2 of seqs) {
                let i0 = 0, i1 = 1;

                // 1. تتبع الخلطة الثانية (عكسياً)
                for (let j = seq2.length - 1; j >= 0; j--) {
                    i0 = reverseIndex(i0, seq2[j], L); i1 = reverseIndex(i1, seq2[j], L);
                }
                // 2. تتبع العكس الكامل
                i0 = L - 1 - i0; i1 = L - 1 - i1;
                // 3. تتبع الخلطة الأولى (عكسياً)
                for (let j = seq1.length - 1; j >= 0; j--) {
                    i0 = reverseIndex(i0, seq1[j], L); i1 = reverseIndex(i1, seq1[j], L);
                }

                // JT هو بداية الـ Base64 لـ %7B (القوس {) أو %5B (القوس [)
                if (s[i0] === 'J' && s[i1] === 'T') {
                    let i2 = 2, i3 = 3;
                    for (let j = seq2.length - 1; j >= 0; j--) { i2 = reverseIndex(i2, seq2[j], L); i3 = reverseIndex(i3, seq2[j], L); }
                    i2 = L - 1 - i2; i3 = L - 1 - i3;
                    for (let j = seq1.length - 1; j >= 0; j--) { i2 = reverseIndex(i2, seq1[j], L); i3 = reverseIndex(i3, seq1[j], L); }

                    let chars = s[i2] + s[i3];
                    if (chars === 'dC' || chars === 'VC' || chars === 'VG') {
                        found = { first: seq1, second: seq2 };
                        break;
                    }
                }
            }
            if (found) break;
        }

        if (found) {
            console.log(`\n✅ تم اختراق التشفير بنجاح!`);
            console.log(`🔑 المفتاح الأول: [${found.first.join(', ')}]`);
            console.log(`🔑 المفتاح الثاني: [${found.second.join(', ')}]`);

            // فك التشفير الفعلي واستخراج الأسئلة
            let decrypted = s;
            for (let num of found.first) { decrypted = chunkReverse(decrypted, num); }
            decrypted = decrypted.split('').reverse().join('');
            for (let num of found.second) { decrypted = chunkReverse(decrypted, num); }

            const binary = Buffer.from(decrypted, 'base64').toString('binary');
            const uriEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
            const finalJson = decodeURIComponent(uriEncoded).replace(/^\uFEFF/, '').trim();

            const data = JSON.parse(finalJson);
            fs.writeFileSync('questions_sample.json', JSON.stringify(data, null, 2));
            console.log(`\n📁 تم حفظ ${data.length} سؤال في ملف questions_sample.json`);
            console.log(`📌 عينة (السؤال الأول):`);
            console.log(JSON.stringify(data[0], null, 2).substring(0, 300) + "...\n");
        } else {
            console.log("\n❌ لم يتم العثور على المفتاح، قد يكونوا أضافوا طبقة تشفير إضافية.");
        }

    } catch (error) {
        console.error("❌ حدث خطأ:", error.message);
    }
}

fetchAndCrack();