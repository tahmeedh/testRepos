import { Page } from '@playwright/test';

export class GrcpBaseController {
    /**
     * Send a GRCP request to the backend.
     * @param page PageFunction. Unused variable.
     * @param msgData Message data to send.
     */
    static async sendRequest(page: Page, msgData) {
        await page
            .frameLocator('#message-iframe')
            .locator(':root')
            .evaluate(
                // Since the first param returns a function and we need the second param to pass in the data. pageFunction is just an unused variable.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (pageFunction, data) => {
                    (window as any).grcpConnector.get().send(data);
                },
                msgData
            );
    }
}
