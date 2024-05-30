import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { USERS_INTEG1 } from 'Constants/users-integ1';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = USERS_INTEG1.WA_USER7_WTC;
const user2 = USERS_INTEG1.WA_USER10_WTC;

test(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;

    await test.step(`GIVEN`, async () => {
        await test.step(`Open browsers`, async () => {
            browser1 = await browser.newContext();
            const user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);

            browser2 = await browser.newContext();
            const user2Page = await browser2.newPage();
            app2 = new BaseController(user2Page);
        });
        const randomContentFromUser1 = StringUtils.generateString();
        const randomContentFromUser2 = StringUtils.generateString();
        const randomContentFromUser3 = StringUtils.generateString();

        await test.step(`Step 1 - User1 logs in`, async () => {
            await app1.goToLoginPage('integ1');
            await app1.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
            await app1.portalController.closeEnableDesktopNotification();
        });

        await test.step(`Step 2 - User1 can open existing conversation by creating a conversation`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User1 creates a conversation with a phone number that already has an existing conversation `, async () => {
                    await app1.hubHeaderController.clickStartChatButton();
                    await app1.hubHeaderController.selectHeaderMainMenuOption('WhatsApp');
                    await app1.createChatController.fillExternalSearchField(user2.PHONE_NUMBER);
                    await app1.createChatController.clickAddPhoneNumber();
                    await app1.createChatController.clickFooterButton('Next');
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Header elements are displayed`, async () => {
                    await expect(app1.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
                    await expect(app1.chatController.Pom.AVATAR).toBeVisible();
                    await expect(app1.chatController.Pom.AVATAR_WHATSAPP_ICON).toBeVisible();
                    await expect(app1.chatController.Pom.CHAT_HEADER_TEXT).toHaveText('WA USER10');
                    await expect(app1.chatController.Pom.COMPANY_POSITION).toHaveText(
                        'Wellington Test Company'
                    );
                    await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
                    await expect(app1.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
                    await expect(app1.chatController.Pom.CHAT_HEADER_MENU).toBeVisible();
                });

                await test.step(`Footer elements are displayed`, async () => {
                    await expect(app1.chatController.Pom.CHAT_INPUT).toBeVisible();
                    await expect(app1.chatController.Pom.CHAT_INPUT_DRAFT_EDITOR).toHaveText(
                        'Enter WhatsApp message'
                    );
                    await expect(app1.chatController.Pom.EMOJI_ICON).toBeVisible();
                    await expect(app1.chatController.Pom.ATTACH_BUTTON).toBeVisible();
                    await expect(app1.chatController.Pom.SEND_BUTTON).toBeVisible();
                    await expect(app1.chatController.Pom.SEND_BUTTON).toBeDisabled();
                });
            });
        });

        await test.step(`Step 3 - User1 can send message and emoji`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User1 types in chat input`, async () => {
                    await app1.chatController.typeContent(randomContentFromUser1);
                });

                await test.step(`AND User1 Clicks on send button`, async () => {
                    await app1.chatController.clickSendButton();
                });
            });
            await test.step(`THEN`, async () => {
                await test.step(`Message is displayed in chat feed`, async () => {
                    await expect(
                        app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                            '.m-auto-message-content'
                        )
                    ).toHaveText(randomContentFromUser1);
                });

                await test.step(`AND timestamp is displayed under the same message row`, async () => {
                    await expect(
                        app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                    ).toBeVisible();
                });

                await test.step(`AND sent icon is displayed under the same message row`, async () => {
                    await expect(
                        app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.icon-sent')
                    ).toBeVisible();
                });
            });
        });

        await test.step(`Step 4 - User2 logs in`, async () => {
            await app2.goToLoginPage('integ1');
            await app2.loginController.loginToPortal(user2.EMAIL, user2.PASSWORD);
            await app2.portalController.closeEnableDesktopNotification();
        });

        await test.step(`Step 5 - User2 can receive message`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User2 creates a conversation with a phone number that already has an existing conversation `, async () => {
                    await app2.hubHeaderController.clickStartChatButton();
                    await app2.hubHeaderController.selectHeaderMainMenuOption('WhatsApp');
                    await app2.createChatController.fillExternalSearchField(user1.PHONE_NUMBER);
                    await app2.createChatController.clickAddPhoneNumber();
                    await app2.createChatController.clickFooterButton('Next');
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Recevied message is displayed in chat feed`, async () => {
                    await expect(
                        app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                            '.m-auto-message-content'
                        )
                    ).toHaveText(randomContentFromUser1);
                });

                await test.step(`AND timestamp is displayed under the same message row`, async () => {
                    await expect(
                        app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                    ).toBeVisible();
                });

                await test.step(`AND new message line is displayed`, async () => {
                    await expect(app2.chatController.Pom.NEW_MESSAGE_LINE).toBeVisible();
                });
            });
        });

        await test.step(`Step 6 - User2 can send emoji to User1`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User2 selects emoji`, async () => {
                    await app2.chatController.typeContent(randomContentFromUser2);
                    await app2.chatController.clickOnEmojiIcon();
                    await app2.chatController.selectEmoji(0);
                });

                await test.step(`AND User2 Clicks on send button`, async () => {
                    await app2.chatController.clickSendButton();
                    await expect(app2.chatController.Pom.EMOJI_PICKER).not.toBeVisible();
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`User2 can send message`, async () => {
                    await test.step(`message is displayed in chat feed`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-message-content'
                            )
                        ).toHaveText(randomContentFromUser2);
                    });

                    await test.step(`AND emoji is displayed in chat feed`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.emoji')
                        ).toHaveAttribute('alt', '🙂');
                    });

                    await test.step(`AND timestamp is displayed under the same message row`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                        ).toBeVisible();
                    });

                    await test.step(`AND sent icon is displayed under the same message row`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.icon-sent')
                        ).toBeVisible();
                    });

                    await test.step(`AND new message line disappear`, async () => {
                        await expect(app2.chatController.Pom.NEW_MESSAGE_LINE).not.toBeVisible();
                    });
                });

                await test.step(`AND User1 can receive message`, async () => {
                    await test.step(`message is displayed in chat feed`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-message-content'
                            )
                        ).toHaveText(randomContentFromUser2, { timeout: 20000 });
                    });

                    await test.step(`AND emoji is displayed in chat feed`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.emoji')
                        ).toHaveAttribute('alt', '🙂');
                    });

                    await test.step(`AND timestamp is displayed under the same message row`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                        ).toBeVisible();
                    });

                    await test.step(`AND new message line is not displayed because user is in focus`, async () => {
                        await expect(app1.chatController.Pom.NEW_MESSAGE_LINE).not.toBeVisible();
                    });
                });
            });
        });

        await test.step(`Step 7 - User1 can send image with caption and User2 can receive image with caption`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User1 attach image in chat input`, async () => {
                    const file = './asset/download.png';
                    await app1.chatController.attachfile(file);
                    await app1.previewAttachmentController.fillCaption(randomContentFromUser3);
                });

                await test.step(`AND User1 Clicks on send button`, async () => {
                    await app1.previewAttachmentController.clickSendButton();
                });
            });
            await test.step(`THEN`, async () => {
                await test.step(`User1 can send image with caption`, async () => {
                    await test.step(`caption is displayed in chat feed`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-message-content'
                            )
                        ).toHaveText(randomContentFromUser3);
                    });

                    await test.step(`AND image is displayed in chat bubble`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-file-handler'
                            )
                        ).toBeVisible();
                    });

                    await test.step(`AND timestamp is displayed under the same message row`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                        ).toBeVisible();
                    });

                    await test.step(`AND sent icon is displayed under the same message row`, async () => {
                        await expect(
                            app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.icon-sent')
                        ).toBeVisible();
                    });
                });

                await test.step(`User2 can receive attachment with caption`, async () => {
                    await test.step(`caption is displayed in chat feed`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-message-content'
                            )
                        ).toHaveText(randomContentFromUser3);
                    });

                    await test.step(`AND image is displayed in chat bubble`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator(
                                '.m-auto-file-handler'
                            )
                        ).toBeVisible();
                    });

                    await test.step(`AND timestamp is displayed under the same message row`, async () => {
                        await expect(
                            app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.timestamp')
                        ).toBeVisible();
                    });
                });
            });
        });

        await test.step(`Step 8 - User1 can open image`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User1 clicks on image `, async () => {
                    await app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).click();
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Image preview is displayed for User1`, async () => {
                    await test.step(`Header elements are visible`, async () => {
                        await expect(app1.attachmentViewerController.Pom.CLOSE_BUTTON).toBeVisible();
                        await expect(app1.attachmentViewerController.Pom.PARTICIPANT_NAME).toHaveText(
                            'WA USER10'
                        );
                        await expect(app1.attachmentViewerController.Pom.TIMESTAMP).toBeVisible();
                        await expect(app1.attachmentViewerController.Pom.COPY_ICON).toBeVisible();
                        await expect(app1.attachmentViewerController.Pom.DOWNLOAD_ICON).toBeVisible();
                    });

                    await test.step(`Image is displayed`, async () => {
                        await expect(app1.attachmentViewerController.Pom.IMAGE_VIEWER).toBeVisible();
                    });

                    await test.step(`Caption is displayed`, async () => {
                        await expect(app1.attachmentViewerController.Pom.CAPTION).toHaveText(
                            randomContentFromUser3
                        );
                    });
                });
            });
        });

        await test.step(`Step 9 - User2 can open image`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User2 clicks on image `, async () => {
                    await app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).click();
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Image preview is displayed for User2`, async () => {
                    await test.step(`Header elements are visible`, async () => {
                        await expect(app2.attachmentViewerController.Pom.CLOSE_BUTTON).toBeVisible();
                        await expect(app2.attachmentViewerController.Pom.PARTICIPANT_NAME).toHaveText(
                            'WA USER7'
                        );
                        await expect(app2.attachmentViewerController.Pom.TIMESTAMP).toBeVisible();
                        await expect(app2.attachmentViewerController.Pom.COPY_ICON).toBeVisible();
                        await expect(app2.attachmentViewerController.Pom.DOWNLOAD_ICON).toBeVisible();
                    });

                    await test.step(`Image is displayed`, async () => {
                        await expect(app2.attachmentViewerController.Pom.IMAGE_VIEWER).toBeVisible();
                    });

                    await test.step(`Caption is displayed`, async () => {
                        await expect(app2.attachmentViewerController.Pom.CAPTION).toHaveText(
                            randomContentFromUser3
                        );
                    });
                });
            });
        });

        await test.step(`Step 10 - User1 can close file preview`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User1 clicks close button `, async () => {
                    await app1.attachmentViewerController.clickCloseButton();
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Feed view is visible`, async () => {
                    await expect(
                        app1.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.m-auto-file-handler')
                    ).toBeInViewport();
                });
            });
        });

        await test.step(`Step 11 - User2 can close file preview`, async () => {
            await test.step(`WHEN`, async () => {
                await test.step(`User2 clicks close button `, async () => {
                    await app2.attachmentViewerController.clickCloseButton();
                });
            });

            await test.step(`THEN`, async () => {
                await test.step(`Feed view is visible`, async () => {
                    await expect(
                        app2.chatController.Pom.MESSAGE_ROW_CONTAINER.nth(-1).locator('.m-auto-file-handler')
                    ).toBeInViewport();
                });
            });
        });
    });
});
