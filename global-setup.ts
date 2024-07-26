/* eslint-disable no-console, @typescript-eslint/require-await */
import { readFileSync } from 'fs';

async function globalSetup() {
    console.info(`Global Setup started.`);

    // check node version against .nvmrc file
    const currentNodeVersion = process.version;
    const expectedNodeVersion = readFileSync('./.nvmrc').toString();
    if (currentNodeVersion === expectedNodeVersion) {
        console.info(`✅Node version - Expected: ${expectedNodeVersion}. Actual: ${currentNodeVersion}.`);
    } else {
        throw new Error(
            `Node version does not match expected version. Expected: ${expectedNodeVersion}. Actual: ${currentNodeVersion}.`
        );
    }
    console.info(`Global Setup completed.`);
}
export default globalSetup;
