const fs = require('fs');
const axios = require('axios');

// الهيدرز بتاعة المتصفح عشان السيرفر ميشكش فينا
const HEADERS = {
    "accept": "*/*",
    "origin": "https://t.tahdiri.com",
    "referer": "https://t.tahdiri.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
};

// ==========================================
// 1. دوال فك تشفير الأسئلة (المعقدة)
// ==========================================
function chunkReverse(str, chunkSize) {
    if (!str) return '';
    const chunks = str.match(new RegExp('.{1,' + chunkSize + '}', 'g')) || [];
    return chunks.map(c => c.split('').reverse().join('')).join('');
}

function decryptCompetitorPayload(encryptedString) {
    try {
        let s = encryptedString.trim();
        s = chunkReverse(s, 11); s = chunkReverse(s, 2); s = chunkReverse(s, 3); s = chunkReverse(s, 4);
        s = s.split('').reverse().join('');
        s = chunkReverse(s, 9); s = chunkReverse(s, 8); s = chunkReverse(s, 7); s = chunkReverse(s, 6); s = chunkReverse(s, 5);
        const binary = Buffer.from(s, 'base64').toString('binary');
        const uriEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
        return JSON.parse(decodeURIComponent(uriEncoded).replace(/^\uFEFF/, '').trim());
    } catch (err) {
        return null;
    }
}

// ==========================================
// 2. تشفير الطلب (البسيط جداً اللي اكتشفناه بفضلك)
// ==========================================
function generateAParameter(lessonId) {
    return Buffer.from(String(lessonId), 'utf8').toString('base64');
}

// ==========================================
// 3. المحرك الأساسي (بيسحب من ملفك مباشرة)
// ==========================================
async function startScraping() {
    console.log("🚀 جاري سحب الأسئلة اعتماداً على داتا مدرستي...\n");

    // قراءة ملفك
    const coursesData = JSON.parse(fs.readFileSync('./madrasati_courses_clean.json', 'utf8'));
    let allQuestionsBank = [];

    for (const course of coursesData) {
        if (!course.groups) continue;

        for (const group of course.groups) {
            for (const lesson of group) {
                const lessonId = lesson.id;
                const lessonName = lesson.info ? lesson.info.name : "بدون اسم";

                console.log(`🔍 سحب درس: "${lessonName}" -> ID: ${lessonId}`);

                // التشفير البسيط للرقم
                const token = generateAParameter(lessonId);

                try {
                    // جلب الأسئلة مباشرة من سيرفر q
                    const qsRes = await axios.get(`https://q.tahdiri.com/app/qs.php?a=${token}`, { headers: HEADERS, timeout: 8000 });

                    if (qsRes.data && typeof qsRes.data === 'string') {
                        const questions = decryptCompetitorPayload(qsRes.data);

                        if (questions && questions.length > 0) {
                            console.log(`    ✅ نجاح! تم سحب ${questions.length} سؤال.`);
                            allQuestionsBank.push({
                                subject_id: course.subjectId,
                                lesson_id: lessonId,
                                lesson_name: lessonName,
                                questions: questions
                            });
                        } else {
                            console.log(`    ⚠️ لا توجد أسئلة لهذا الدرس عند المنافس.`);
                        }
                    }
                } catch (qErr) {
                    console.log(`    ❌ فشل الاتصال: ${qErr.message}`);
                }

                // استراحة لحماية الـ IP
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // حفظ بعد كل مادة
        fs.writeFileSync('./final_questions_bank.json', JSON.stringify(allQuestionsBank, null, 2));
    }

    console.log("\n🎉 تمت العملية بنجاح! راجع ملف final_questions_bank.json");
}

startScraping();