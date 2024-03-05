import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class PortalPage extends BasePage {
    readonly ENABLE_DESKTOP_NOTIFICATION_CLOSE_BUTTON: Locator;
    readonly NEW_FEATURE_TOOLTIP_CLOSE_BUTTON: Locator;
    readonly HEADER_MAIN_MENU_BUTTON: Locator;
    readonly HEADER_MAIN_MENU_CONTAINER: Locator;

    constructor(page: Page) {
        super(page);
        this.ENABLE_DESKTOP_NOTIFICATION_CLOSE_BUTTON = this.page.locator('.m-auto-notification-close-icon');
        this.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON = this.page.locator('.m-auto-new-feature-tooltip-close');
        this.HEADER_MAIN_MENU_BUTTON = this.page.locator('.m-auto-header-main-menu-image');
        this.HEADER_MAIN_MENU_CONTAINER = this.page.locator('.m-auto-header-main-menu');
    }
}
