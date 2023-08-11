## Installation
To install:
```js script
nvm use
npm ci
```

## Setup git submodules
```
1. cd sm-api
2. git submodule init
3. git submodule update
4. npm i 
5. cd .. 
```

## Run automations

To run test:
Ensure git submodule and dependencies are set up before running tests 
If SERVER is not specify, CPQA2-VA1 will be used by default.
Install dependency : `npm i` \
Runs all tests: `SERVER=<env> npm run test` \
Runs specific test case: `SERVER=<env> npm run test-filter C1234567` \
Runs specific test case with browser: `SERVER=<env> npm run test-headed C1234567` \
Runs specific test file: `npx playwright test whatsapp-feed-view.spec.ts` \
Runs specific test case in debug mode: `SERVER=<env> npm run test-debug C1234567` \
Runs specific test case in slowmo mode: `SLOWMO=TRUE npx playwright test -g C1234567` \
Runs specific test case repeatedly: `npx playwright test -g C1234567 --repeat-each=10` \
Runs playwright codegen: `npx playwright codegen` \
Runs HTML Reporter: `npm run report` \
* full reference: https://playwright.dev/docs/test-cli \