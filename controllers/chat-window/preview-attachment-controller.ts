import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { PreviewAttachmentPage } from 'Poms/chat-window/preview-attachment-page';

export class PreviewAttachmentController {
    readonly page: Page;
    readonly Pom: PreviewAttachmentPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new PreviewAttachmentPage(this.page);
    }

    async sendAttachment(filePath: string) {
        await test.step('Preview Attachment Controller : Send Attachment', async () => {
            await this.Pom.ATTACH_FILES_BUTTON.setInputFiles(filePath);
            await this.Pom.SEND_BUTTON.click();
        });
    }

    async attachFile(filePath: string) {
        await test.step('Preview Attachment Controller : Attach file ', async () => {
            await this.Pom.ATTACH_FILES_BUTTON.setInputFiles(filePath);
        });
    }

    async clickSendButton() {
        await test.step('Preview Attachment Controller : Click Send Button ', async () => {
            await this.Pom.PREVIEW_SEND_BUTTON.click();
        });
    }

    async fillCaption(input: string) {
        await test.step(`File Preview Controller - Fill ${input} in caption`, async () => {
            await this.Pom.CAPTION_INPUT.fill(input);
        });
    }
}
