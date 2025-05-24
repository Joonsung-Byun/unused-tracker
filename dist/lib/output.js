import fs from 'fs';
import path from 'path';
export function writeJsonReport(data) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `unused-functions-${timestamp}.json`;
    const outputPath = path.join(process.cwd(), "output", "json", fileName);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n📝 JSON 리포트가 생성되었습니다: ${fileName}`);
}
export function writeHtmlReport(data) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `unused-functions-${timestamp}.html`;
    const outputPath = path.join(process.cwd(), "output", "html", fileName);
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Unused Functions Report</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 8px 12px; border: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Unused Functions Report</h1>
  <p>Generated: ${now.toLocaleString()}</p>
  <table>
    <thead>
      <tr><th>Function Name</th><th>File</th><th>Line</th></tr>
    </thead>
    <tbody>
      ${data.map(f => `<tr><td>${f.name}</td><td>${f.file}</td><td>${f.line}</td></tr>`).join('\n')}
    </tbody>
  </table>
</body>
</html>
  `;
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');
    console.log(`\n🌐 HTML 리포트가 생성되었습니다: ${fileName}`);
}
