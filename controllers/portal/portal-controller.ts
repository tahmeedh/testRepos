import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { PortalPage } from 'Poms/portal/portal-page';

export class PortalController {
    readonly page: Page;
    readonly Pom: PortalPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new PortalPage(this.page);
    }

    async closeEnableDesktopNotification() {
        await test.step('Portal Controller : Click on enable desktop notification close button', async () => {
            Log.info(`Portal Controller: Click on enable desktop notification close button'`);
            try {
                await this.Pom.ENABLE_DESKTOP_NOTIFICATION_CLOSE_BUTTON.click();
            } catch {
                Log.info('Enable Desktop notification did not appear. Skipping to next step.');
            }
        });
    }

    async clickCloseSMSEnabledNotification() {
        await test.step('Portal Controller : Click on Close text enabled notification', async () => {
            Log.info(`Portal Controller: Click on Close text enabled notification`);
            await this.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON.click();
        });
    }

    async closeGRPhoneNumberNotification() {
        // eslint-disable-next-line max-len
        await test.step(`Portal Controller: Close 'View your Global Relay number and set up call-forwarding in your profile.' notification`, async () => {
            Log.info(
                `Portal Controller: Close 'View your Global Relay number and set up call-forwarding in your profile.' notification`
            );
            await this.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON.click();
        });
    }

    async clickHeaderMainMenu() {
        await test.step('Portal Controller : Click on header main menu', async () => {
            Log.info(`Portal Controller: Click on header main menu`);
            await this.Pom.HEADER_MAIN_MENU_BUTTON.click();
        });
    }

    async selectHeaderMainMenuOption(
        option: 'Profile' | 'Settings' | 'About' | 'Privacy Policy' | 'Log out'
    ) {
        await test.step(`Portal Controller : Selecting '${option}' option from header main menu`, async () => {
            Log.info(`Portal Controller : Selecting '${option}' option from header main menu`);
            await this.Pom.HEADER_MAIN_MENU_CONTAINER.getByText(option).click();
        });
    }

    async selectGrWorkspaceButton() {
        await test.step('Select GR Workspace Button', async () => {
            Log.info(`Portal Controller: Select Global Relay Workspace Button`);
            await this.Pom.GR_BUTTON.click();
        });
    }

    async selectGrDirectoryButton() {
        await test.step('Select GR Workspace Button', async () => {
            Log.info(`Portal Controller: Select Global Relay Directory Button`);
            await this.Pom.GR_DIRECTORY_BUTTON.click();
        });
    }
}
