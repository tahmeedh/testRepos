import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class NavigationPage extends BasePage {
    readonly page: Page;
    readonly CHATS_BUTTON: Locator;
    readonly CONTACTS_BUTTON: Locator;
    readonly MESSAGE_HUB_HIDE_BUTTON: Locator;

    constructor(page: Page) {
        super(page);
        this.CHATS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-chats-button');
        this.CONTACTS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-contacts-button');
        this.MESSAGE_HUB_HIDE_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-toggle-hide-button');
    }
}
