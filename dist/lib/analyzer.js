import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { writeJsonReport } from './output.js';
export async function detectUnusedFunctions(targetDir, options) {
    const project = new Project({ tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json') });
    // ✅ 확실하게 대상 파일을 추가
    project.addSourceFilesAtPaths(`${targetDir}/**/*.{ts,tsx}`);
    const sourceFiles = project.getSourceFiles();
    console.log('📁 분석 대상 파일들:', sourceFiles.map(f => f.getFilePath()));
    console.log(`🔍 ${sourceFiles.length}개의 파일에서 함수 사용 여부를 분석합니다...`);
    const unusedFunctions = [];
    for (const file of sourceFiles) {
        const filePath = file.getFilePath();
        // 일반 함수 선언
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
        // 변수에 저장된 화살표 함수 또는 function expression
        const variableDeclarations = file.getVariableDeclarations();
        for (const decl of variableDeclarations) {
            const name = decl.getName();
            const initializer = decl.getInitializer();
            if (!initializer)
                continue;
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
}
