# unused-functions-detector
TypeScript 프로젝트에서 사용되지 않는 함수를 분석하고 JSON/HTML 리포트를 생성하는 CLI 도구입니다.

## 만들게 된 계기
2025년 1월부터 4월까지 미국 Saltlake City에 스타트업 LaunchWith에서 풀스택 엔지니어 인턴으로 근무하였습니다. 종종 다른 인턴 개발자들의 코드를 리뷰하고 수정하는 일을 맡았는데, 함수를 선언했지만 사용하지 않아서 파일의 가독성이 떨어지거나 이 함수를 제거해야되는지 아닌지에 관해 이야기를 해야할 일이 많았습니다. 만약 미사용 함수들을 정리하여 함수의 이름, 파일, 위치를 시각화된 리포트로 만들면 이를 참고해 관련된 회의 시간을 줄이고 개발 환경에 큰 도움이 될 수 있을것이라 생각합니다. 실제로 마주했던 문제를 해결하기 위해 만든 이 라이브러리는 지금 npm에 배포가 되어있으며 누구나 설치를 하여 사용할 수 있습니다.

## 설치
npm i unused-tracker

## 기능
npx unused-functions-detector ./src --json --html --exclude=tests/** --ci --only-warn

--json : JSON 리포트 생성

--html : HTML 리포트 생성

--ci : CI 환경에서 실패 처리

--only-warn : CI에서 경고만 출력하고 실패하지 않음

--exclude=패턴 : 특정 경로 제외

패키지 설치 후, 기본적인 방법은 npx unused-functions-detector 디렉토리 --옵션입니다
예) npx unused-functions-detector ./src --json

--json과 --html은 미사용 함수의 이름과 위치를 알려준뒤 리포트를 생성합니다. 위 리포트를 생성하기 위해서는 프로젝트 루트경로에 output 폴더를 생성한뒤 그 아래 html 폴더와 json 폴더를 생성하세요.

Continous Integration을 위해 추가한 --ci 옵션은 Github Actions에서 활용이 가능한 미사용 함수 체크 기능입니다. unused-check.yml을 활용하여 코드를 push 했을때 자동으로 코드에 미사용 함수가 있는지 체킹을 해준뒤, 만약 존재시에는 process.exit(1)를 통해 PR과 Merge를 방지합니다. 하지만 개발시에는 이런 체크가 불필요한 과정일 수 있습니다. 개발중에서는 unused-check.yml에 --ci --only-warn을 활용하여 미사용 함수가 있지만 CI를 통과시킬 수 있습니다.



