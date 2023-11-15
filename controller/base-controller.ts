import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';

import { LOGIN_ENDPOINTS } from 'Constants/login-endpoints';
import { LoginEndpointUtils } from 'helper/login-endpoint-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BasePage } from '../poms/base-page';
import { LoginController } from './login-controller';
import { StartChatButtonController } from './start-chat-button-controller';
import { CreateChatController } from './create-chat-controller';
import { ChatController } from './chat-page-controller';
import { PreviewAttachmentController } from './preview-attachment-controller';

import { InviteController } from './invite-controller';
import { MessageHubController } from './message-hub-controller';
import { VCardController } from './v-card-controller';
import 'dotenv/config';

export class BaseController {
    readonly page: Page;
    readonly Pom: BasePage;
    readonly loginController: LoginController;
    readonly startChatButtonController: StartChatButtonController;
    readonly createChatController: CreateChatController;
    readonly chatController: ChatController;
    readonly attachmentController: PreviewAttachmentController;
    readonly inviteController: InviteController;
    readonly messageHubController: MessageHubController;
    readonly vCardController: VCardController;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new BasePage(this.page);
        this.loginController = new LoginController(this.page);
        this.startChatButtonController = new StartChatButtonController(this.page);
        this.createChatController = new CreateChatController(this.page);
        this.chatController = new ChatController(this.page);
        this.attachmentController = new PreviewAttachmentController(this.page);
        this.inviteController = new InviteController(this.page);
        this.messageHubController = new MessageHubController(this.page);
        this.vCardController = new VCardController(this.page);
    }

    async closeTooltips() {
        await test.step('Base Controller : Close SMS Tooltips', async () => {
            try {
                await expect(this.Pom.TOOLTIP_NEXT_BUTTON).toBeVisible({ timeout: 5000 });
            } catch (e) {
                try {
                    await expect(this.Pom.TOOLTIP_CLOSE_BUTTONA).toBeVisible();
                } catch (err) {
                    try {
                        await expect(this.Pom.TOOLTIP_CLOSE_BUTTON).toBeVisible();
                    } catch (error) {
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
        });
    }

    async logout() {
        await test.step('Base Controller : Log Out', async () => {
            await this.Pom.SETTINGS_BAR_BUTTON.click();
            await this.Pom.LOG_OUT_BUTTON.click();
        });
    }

    /**
     * @param {String} title Title of MUC / Channel to be opened
     */
    async open(title: string) {
        await test.step('Base Controller : Open MUC or Channel', async () => {
            const chat = this.Pom.MESSAGEIFRAME.getByText(title);
            await chat.click();
        });
    }

    async clickAvatar(nth: string) {
        await test.step('Click avatar in enter v-card', async () => {
            await this.Pom.AVATAR.nth(parseFloat(nth)).click();
        });
    }

    async goToLoginPage() {
        await test.step('Base Controller : Go to login page', async () => {
            const env = process.env.SERVER;
            if (!LoginEndpointUtils.isLoginEndPointValid(env)) {
                const error = new Error();
                Log.error(
                    `FAILURE: Process.env.SERVER '${env}' is not valid. Unable to find login URL.`,
                    error
                );
                throw error;
            }
            await this.page.goto(LOGIN_ENDPOINTS[env]);
        });
    }
}
