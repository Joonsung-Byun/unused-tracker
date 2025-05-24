#!/usr/bin/env node
import path from 'path';
import { detectUnusedFunctions } from './lib/analyzer.js';
const args = process.argv.slice(2);
const targetDir = args[0];
const outputAsJson = args.includes('--json');
const outputAsHtml = args.includes('--html');
const onlyWarn = args.includes('--only-warn');
const isCI = args.includes('--ci');
const excludePatternArg = args.find(arg => arg.startsWith('--exclude='));
const excludePattern = excludePatternArg ? excludePatternArg.split('=')[1] : undefined;
if (!targetDir) {
    console.error('❌ 분석할 디렉토리를 인자로 제공해주세요. 예: npx unused-functions-detector ./src');
    process.exit(1);
}
await detectUnusedFunctions(path.resolve(process.cwd(), targetDir), {
    outputAsJson,
    outputAsHtml,
    isCI,
    onlyWarn,
    exclude: excludePattern,
});
