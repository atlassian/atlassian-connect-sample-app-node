import { chromium } from "@playwright/test";
import { jiraAppInstall, jiraLogin } from './utils/jira';
import { clearState, stateExists } from './utils/e2e-utils';
import { ngrokBypass } from './utils/ngrok';
import { testData } from './utils/constants';

export default async function setup() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Remove old state before starting
    clearState();

    // login and save state before tests
    await Promise.all([
        ngrokBypass(page).then(async (page) => jiraLogin(page, "admin", true))
    ]);

    await jiraAppInstall(page);
    // Close the browser
    await browser.close();

    // Check to make sure state exists before continuing
    if (!stateExists(testData.jira.roles.admin)) {
        throw "Missing state";
    }
}
