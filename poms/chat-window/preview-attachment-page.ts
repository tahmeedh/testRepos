import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class PreviewAttachmentPage extends BasePage {
    readonly page: Page;
    readonly ATTACH_FILES_BUTTON: Locator;
    readonly SEND_BUTTON: Locator;
    readonly CAPTION_INPUT: Locator;

    constructor(page: Page) {
        super(page);
        this.ATTACH_FILES_BUTTON = this.CHATIFRAME.locator('.m-auto-attach-button');
        this.SEND_BUTTON = this.CHATIFRAME.getByRole('button', { name: 'Send' });
        this.CAPTION_INPUT = this.CHATIFRAME.locator('.m-auto-caption-input-wrapper').getByRole('textbox', {
            name: 'input-label'
        });
    }
}
