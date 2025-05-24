import fs from 'fs';
import path from 'path';
[];
export function writeJsonReport(data) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `unused-functions-${timestamp}.json`;
    const outputPath = path.join(process.cwd(), "output", fileName);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n📝 JSON 리포트가 생성되었습니다: ${fileName}`);
}
