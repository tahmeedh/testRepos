import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class AttachmentViewerPage extends BasePage {
    readonly page: Page;
    readonly CLOSE_BUTTON: Locator;
    readonly PARTICIPANT_NAME: Locator;
    readonly TIMESTAMP: Locator;
    readonly COPY_ICON: Locator;
    readonly DOWNLOAD_ICON: Locator;
    readonly IMAGE_VIEWER: Locator;
    readonly CAPTION: Locator;

    constructor(page: Page) {
        super(page);
        this.CLOSE_BUTTON = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-preview-close'
        );
        this.PARTICIPANT_NAME = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-primary-text'
        );
        this.TIMESTAMP = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-secondary-text'
        );
        this.COPY_ICON = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-copy-file-icon'
        );
        this.DOWNLOAD_ICON = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-download-icon'
        );
        this.IMAGE_VIEWER = this.CHATIFRAME.locator(
            '.m-auto-file-attachment-preview-container .m-auto-file-display-body-image'
        );
        this.CAPTION = this.CHATIFRAME.locator('.m-auto-file-attachment-preview-container .m-auto-caption');
    }
}
