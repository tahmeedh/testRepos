import type { Locator, Page } from '@playwright/test';
import { previewAttachmentPage } from '../poms/preview-attachment-page';
import { test } from '@playwright/test';

export class PreviewAttachmentController {
    readonly page: Page;
    readonly Pom : previewAttachmentPage;

    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new previewAttachmentPage(this.page);
    }

    async sendAttachment(filePath : string) {
        await test.step ("Preview Attachment Controller : Send Attachment", async () => {
            await this.Pom.ATTACH_FILES_BUTTON.setInputFiles(filePath);
            await this.Pom.SEND_BUTTON.click();
        })

    }



}
