import { Page } from '@playwright/test';

export class GrcpBaseController {
    static async getRequest(page: Page, msgData) {
        // Since the first param returns a function and we need the second param to pass in the data. pageFunction is just an unused variable.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await page
            .frameLocator('#message-iframe')
            .locator(':root')
            .evaluate(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (pageFunction, data) => {
                    (window as any).grcpConnector.get().send(data);
                },
                msgData
            );
    }
}
