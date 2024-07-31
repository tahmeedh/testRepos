/* eslint-disable no-await-in-loop */

import type { Page } from '@playwright/test';
import { errors, test } from '@playwright/test';
import { LOGIN_ENDPOINTS } from 'Constants/login-endpoints';
import { LoginEndpointUtils } from 'helper/login-endpoint-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BasePage } from 'Poms/base-page';
import { IgnoreErrorUtils } from 'helper/ignore-error-utils';
import { LoginController } from './login/login-controller';
import { StartChatButtonController } from './message-hub/start-chat-button-controller';
import { CreateChatController } from './chat-window/create-chat-controller';
import { ChatController } from './chat-window/chat-page-controller';
import { InviteController } from './chat-window/invite-controller';
import { MessageHubController } from './message-hub/message-hub-controller';
import { VCardController } from './chat-window/v-card-controller';
import { DetailsController } from './chat-window/details-controller';
import { VCardEditController } from './chat-window/v-card-edit-controller';
import 'dotenv/config';
import { ContactListController } from './message-hub/contact-list-controller';
import { ConversationListController } from './message-hub/conversation-list-controller';
import { CompanyVCardController } from './chat-window/company-v-card-controller';
import { PortalController } from './portal/portal-controller';
import { NewsAlertController } from './message-hub/news-alert-controller';
import { HubHeaderController } from './message-hub/hub-header-controller';
import { NavigationController } from './message-hub/navigation-controller';
import { SearchResultController } from './message-hub/search-result-controller';
import { PreviewAttachmentController } from './chat-window/preview-attachment-controller';
import { AttachmentViewerController } from './chat-window/attachment-viewer-controller';

export class BaseController {
    readonly page: Page;
    readonly Pom: BasePage;
    readonly loginController: LoginController;
    readonly startChatButtonController: StartChatButtonController;
    readonly createChatController: CreateChatController;
    readonly chatController: ChatController;
    readonly previewAttachmentController: PreviewAttachmentController;
    readonly attachmentViewerController: AttachmentViewerController;
    readonly inviteController: InviteController;
    readonly messageHubController: MessageHubController;
    readonly vCardController: VCardController;
    readonly detailsController: DetailsController;
    readonly vCardEditController: VCardEditController;
    readonly contactListController: ContactListController;
    readonly conversationListController: ConversationListController;
    readonly companyVCardController: CompanyVCardController;
    readonly portalController: PortalController;
    readonly newsAlertController: NewsAlertController;
    readonly hubHeaderController: HubHeaderController;
    readonly navigationController: NavigationController;
    readonly searchResultController: SearchResultController;

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
        this.previewAttachmentController = new PreviewAttachmentController(this.page);
        this.attachmentViewerController = new AttachmentViewerController(this.page);
        this.inviteController = new InviteController(this.page);
        this.messageHubController = new MessageHubController(this.page);
        this.vCardController = new VCardController(this.page);
        this.detailsController = new DetailsController(this.page);
        this.vCardEditController = new VCardEditController(this.page);
        this.contactListController = new ContactListController(this.page);
        this.conversationListController = new ConversationListController(this.page);
        this.companyVCardController = new CompanyVCardController(this.page);
        this.portalController = new PortalController(this.page);
        this.newsAlertController = new NewsAlertController(this.page);
        this.hubHeaderController = new HubHeaderController(this.page);
        this.navigationController = new NavigationController(this.page);
        this.searchResultController = new SearchResultController(this.page);
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

    async goToLoginPage(envOverride?: string): Promise<void> {
        await test.step('Base Controller : Go to login page', async () => {
            const env = envOverride || process.env.SERVER;
            if (!LoginEndpointUtils.isLoginEndPointValid(env)) {
                throw new Error(
                    `FAILURE: Process.env.SERVER '${env}' is not valid. Unable to find login URL.`
                );
            }
            await this.page.goto(LOGIN_ENDPOINTS[env]);
        });
    }

    async inviteParticipants(users, type = 'muc') {
        if (type === 'channel') {
            await this.chatController.clickInviteParicipantsChannels();
            await this.detailsController.clickMemberRolesButton();
            await this.createChatController.inviteChannels(users);
        } else {
            await this.chatController.clickInviteParicipants();
            await this.createChatController.inviteMUC(users);
        }
    }

    async pressKey(keys: string) {
        await test.step(`Base Controller: Press keys ${keys}`, async () => {
            Log.info(`Base Controller: Press keys ${keys}`);
            await this.page.keyboard.press(keys);
        });
    }

    async scrollVertically(numberOfPixel: number) {
        await this.page.mouse.wheel(0, numberOfPixel);
    }

    /**
     * Performs the login and intialization flow: login, close enable desktop notification, and wait for
     * initial loading to complete.
     * @param username username to login with.
     * @param password login password.
     */
    async loginAndInitialize(username: string, password: string) {
        await this.goToLoginPage();
        await this.loginController.loginToPortal(username, password);
        await this.waitForInitialLoad();
        await IgnoreErrorUtils.ignoreError(async () =>
            this.portalController.closeEnableDesktopNotification()
        );
    }

    /**
     * Wait for initial load will wait for the "Loading Global Relay App" spinner to appear and disappear.
     * If operation timedout waiting, it will refresh the page and retry waiting up to 2 times.
     * If app still stuck on loading after 2 tries, page reloads and exit the wait function. In which case,
     * it will most likely fail on time out.
     */
    async waitForInitialLoad() {
        let retryCount = 2; // Hardcode retry number to 2 (waitFor timeout value is 10 seconds).

        while (retryCount > 0) {
            try {
                Log.info('Waiting for load spinner to appear...');
                await this.Pom.LOAD_GR_APP_SPINNER.waitFor({ state: 'visible' });
                Log.info('Load spinner found, waiting for loading to complete...');
                await this.Pom.LOAD_GR_APP_SPINNER.waitFor({ state: 'hidden' });
                retryCount = 0;
                Log.info('Loading app completed.');
            } catch (error) {
                if (error instanceof errors.TimeoutError && retryCount > 0) {
                    Log.warn('Timeout Error while waiting for app to load. Refresh page and try again.');
                    await this.page.reload();
                    retryCount--;
                } else {
                    retryCount = 0;
                    throw error;
                }
            }
        }

        Log.info('Finished waiting for initial load.');
    }

    async enableDebug() {
        await test.step('Base Controller: Enabling debug mode', async () => {
            await this.Pom.CHATIFRAME.locator(':root').evaluate(() => {
                (window as any).gr.config.xdmOutgoing = 1;
                (window as any).gr.config.xdmIncoming = 1;
            });
        });
    }
}
