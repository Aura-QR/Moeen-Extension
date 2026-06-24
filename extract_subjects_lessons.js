const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'madrasati_courses_clean.json');
const outputJsonPath = path.join(__dirname, 'subjects_and_lessons.json');
const outputTxtPath = path.join(__dirname, 'subjects_and_lessons.txt');

try {
  console.log('Loading madrasati_courses_clean.json...');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const results = [];
  let txtOutput = '';

  for (const course of data) {
    if (!course || course.subjectId == null) continue;

    const subjectId = course.subjectId;
    let subjectName = '';

    // Collect all unique lessons
    const seenLessons = new Set();
    const lessons = [];

    // Helper to add lesson
    function addLesson(id, rawName) {
      if (!rawName) return;
      if (seenLessons.has(rawName)) return;
      seenLessons.add(rawName);

      const parts = rawName.split(' -- ');
      let unit = '';
      let lessonName = '';
      if (parts.length > 1) {
        unit = parts[0].trim();
        lessonName = parts.slice(1).join(' -- ').trim();
      } else {
        unit = 'General';
        lessonName = rawName.trim();
      }

      if (!subjectName && unit) {
        subjectName = unit;
      }

      lessons.push({
        id: String(id),
        unit: unit,
        lessonName: lessonName,
        fullName: rawName.trim()
      });
    }

    // Process groups if any
    if (course.groups && Array.isArray(course.groups)) {
      course.groups.forEach(group => {
        const groupList = Array.isArray(group) ? group : [group];
        groupList.forEach(lesson => {
          if (lesson && lesson.info) {
            const id = lesson.info.compositeId || lesson.id;
            addLesson(id, lesson.info.name);
          }
        });
      });
    }

    // Process rawLessonsList
    if (course.rawLessonsList && Array.isArray(course.rawLessonsList)) {
      course.rawLessonsList.forEach(lesson => {
        if (lesson) {
          addLesson(lesson.id, lesson.name);
        }
      });
    }

    // If subjectName is still empty, let's use a default or check if we can get it from first lesson
    if (!subjectName && lessons.length > 0) {
      subjectName = lessons[0].unit;
    }
    if (!subjectName) {
      subjectName = `Subject #${subjectId}`;
    }

    results.push({
      subjectId: subjectId,
      subjectName: subjectName,
      lessonsCount: lessons.length,
      lessons: lessons
    });

    // Append to text output
    txtOutput += `========================================================================\n`;
    txtOutput += `Subject ID: ${subjectId} | Subject/Unit: ${subjectName}\n`;
    txtOutput += `Total Lessons: ${lessons.length}\n`;
    txtOutput += `========================================================================\n`;
    lessons.forEach((l, idx) => {
      txtOutput += `${idx + 1}. [ID: ${l.id}] (Unit: ${l.unit}) -> ${l.lessonName}\n`;
    });
    txtOutput += `\n\n`;
  }

  // Write files
  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2), 'utf8');
  fs.writeFileSync(outputTxtPath, txtOutput, 'utf8');

  console.log(`Success!`);
  console.log(`Extracted ${results.length} subjects.`);
  console.log(`JSON output saved to: ${outputJsonPath}`);
  console.log(`Text output saved to: ${outputTxtPath}`);

} catch (error) {
  console.error('Error processing file:', error);
}
