import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { writeJsonReport, writeHtmlReport } from './output.js';

interface DetectOptions {
  outputAsJson?: boolean;
  outputAsHtml?: boolean;
  isCI?: boolean;
  onlyWarn?: boolean;
  exclude?: string;
}

export async function detectUnusedFunctions(targetDir: string, options?: DetectOptions) {
  const project = new Project({ tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json') });

  const globPattern = options?.exclude
    ? [`${targetDir}/**/*.{ts,tsx}`, `!${options.exclude}`]
    : [`${targetDir}/**/*.{ts,tsx}`];

  project.addSourceFilesAtPaths(globPattern);
  const sourceFiles = project.getSourceFiles();

  console.log('📁 분석 대상 파일들:', sourceFiles.map(f => f.getFilePath()));
  console.log(`🔍 ${sourceFiles.length}개의 파일에서 함수 사용 여부를 분석합니다...`);

  const unusedFunctions: { name: string; file: string; line: number }[] = [];

  for (const file of sourceFiles) {
    const filePath = file.getFilePath();

    const functions = file.getFunctions();
    for (const fn of functions) {
      const name = fn.getName() || '<anonymous>';
      const references = fn.findReferences();

      if (references.length === 1) {
        const line = fn.getNameNode()?.getStartLineNumber?.() || fn.getStartLineNumber();
        console.log(`🚫 미사용 함수: ${name}  (${filePath}:${line})`);
        unusedFunctions.push({ name, file: filePath, line });
      }
    }

    const variableDeclarations = file.getVariableDeclarations();
    for (const decl of variableDeclarations) {
      const name = decl.getName();
      const initializer = decl.getInitializer();

      if (!initializer) continue;
      const isArrowFn = initializer.getKind() === SyntaxKind.ArrowFunction;
      const isFunctionExpr = initializer.getKind() === SyntaxKind.FunctionExpression;

      if (isArrowFn || isFunctionExpr) {
        const references = decl.findReferences();

        if (references.length === 1) {
          const line = decl.getNameNode().getStartLineNumber();
          console.log(`🚫 미사용 함수 변수: ${name}  (${filePath}:${line})`);
          unusedFunctions.push({ name, file: filePath, line });
        }
      }
    }
  }

  if (options?.outputAsJson && unusedFunctions.length > 0) {
    writeJsonReport(unusedFunctions);
  }

  if (options?.outputAsHtml && unusedFunctions.length > 0) {
    writeHtmlReport(unusedFunctions);
  }

  if (options?.isCI && unusedFunctions.length > 0 && !options.onlyWarn) {
    console.error('\n❌ CI 실패: 미사용 함수가 발견되었습니다.');
    process.exit(1);
  } else if (options?.isCI && unusedFunctions.length > 0 && options.onlyWarn) {
    console.warn('\n⚠️ 경고: 미사용 함수가 있지만 --only-warn 옵션으로 CI를 통과시킵니다.');
  }
}