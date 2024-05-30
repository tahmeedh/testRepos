import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { AttachmentViewerPage } from 'Poms/chat-window/attachment-viewer-page';

export class AttachmentViewerController {
    readonly page: Page;
    readonly Pom: AttachmentViewerPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new AttachmentViewerPage(this.page);
    }

    async clickCloseButton() {
        await test.step('Preview Attachment Viewer Controller : Click close button', async () => {
            await this.Pom.CLOSE_BUTTON.click();
        });
    }
}
