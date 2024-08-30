import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class NewsAlertPage extends BasePage {
    readonly page: Page;
    readonly NEWS_ALERT_NEXT_BUTTON: Locator;
    readonly NEW_FEATURE_TOOLTIP_CLOSE_BUTTON: Locator;

    constructor(page: Page) {
        super(page);

        this.NEWS_ALERT_NEXT_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-news-alert-next-link');
        this.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON = this.MESSAGEIFRAME.locator('[data-id="close-sm"]');
    }
}
