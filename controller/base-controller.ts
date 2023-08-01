import type { Browser, Page } from '@playwright/test';
import { test, expect } from '@playwright/test';

import { BasePage } from '../poms/base-page';
import { loginController } from './login-controller';
import { StartChatButtonController } from './start-chat-button-controller';
import { CreateChatController } from './create-chat-controller';
import { ChatController } from './chat-page-controller';
import { PreviewAttachmentController } from './preview-attachment-controller';

import { StringUtils } from '../helper/string-utils';


export class BaseController {

    readonly page: Page;
    readonly Pom : BasePage;
    readonly login: loginController;
    readonly startChat : StartChatButtonController;
    readonly createChat : CreateChatController;
    readonly chat : ChatController;
    readonly attachmentController : PreviewAttachmentController;

    readonly stringUtils : StringUtils;


    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new BasePage(this.page);
        this.login = new loginController(this.page);
        this.startChat = new StartChatButtonController(this.page);
        this.createChat = new CreateChatController(this.page);
        this.chat = new ChatController(this.page);
        this.attachmentController = new PreviewAttachmentController(this.page);

        this.stringUtils = new StringUtils();
        
    }

    async closeTooltips() {
        await test.step ("Base Controller : Close SMS Tooltips", async () => {

            try {
                await expect(this.Pom.TOOLTIP_NEXT_BUTTON).toBeVisible({timeout: 5000 });
            } catch (e) {
                try {
                    await expect(this.Pom.TOOLTIP_CLOSE_BUTTONA).toBeVisible();
                } catch (e) {
                    try {
                        await expect(this.Pom.TOOLTIP_CLOSE_BUTTON).toBeVisible();
                    } catch (e) {
                        return;
                    }
                }
            }

            const nextButtonVisible = await this.Pom.TOOLTIP_NEXT_BUTTON.isVisible();
            const closeButtonVisible = await this.Pom.TOOLTIP_CLOSE_BUTTON.isVisible();
            const closeButtonAVisible = await this.Pom.TOOLTIP_CLOSE_BUTTONA.isVisible();

            if (nextButtonVisible) {
                await this.Pom.TOOLTIP_NEXT_BUTTON.click();
                await this.Pom.TOOLTIP_CLOSE_BUTTON.click();
            } else if (closeButtonVisible) {
                await this.Pom.TOOLTIP_CLOSE_BUTTON.click();
            } else if (closeButtonAVisible) {
                await this.Pom.TOOLTIP_CLOSE_BUTTONA.click();
            }

        })

    }

    async logout() {
        await test.step("Base Controller : Log Out", async () => {
            await this.Pom.SETTINGS_BAR_BUTTON.click();
            await this.Pom.LOG_OUT_BUTTON.click();
        })
    }



}
