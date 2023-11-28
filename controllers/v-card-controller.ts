import type { Page } from '@playwright/test';
import { VCardPage } from '../poms/v-card-page';

export class VCardController {
    readonly page: Page;
    readonly Pom: VCardPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new VCardPage(this.page);
    }
}
