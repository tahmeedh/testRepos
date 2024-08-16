import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export interface CreateSucDataType {
    senderGrcpAlias: string;
    receiverGrcpAlias: string;
    content: string;
}
export interface CreateMucDataType {
    subject: string;
    participantsGrcpAliases: string[];
}
export interface CreateChannelDataType {
    companyIds: number[];
    description: string;
    name: string;
    subject: string;
    type: 'company_unrestricted' | 'company_restricted' | 'business';
}

export class GrcpCreateController {
    /**
     * Create a new one-to-one conversation between a pair of users via grcp calls.
     * User needs to send a message in order to establish a SUC conversation, this is unique to SUC.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param CreateSucData Data about the SUC.
     * @param CreateSucData.senderGrcpAlias Grcp alias of sender.
     * @param CreateSucData.receiverGrcpAlias Grcp alias of receiver.
     * @param CreateSucData.content Content to be sent in the SUC.
     */
    static async createSUC(page: Page, createSucData: CreateSucDataType) {
        //Establish default conversation between the pair of users.
        const resolveDefaultConvoData = {
            clientRequestId: randomUUID(),
            otherParty: createSucData.receiverGrcpAlias,
            msgType: 'conversation.ServerResolveDefaultConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, resolveDefaultConvoData);

        //SUC conversationId is always OlderGrid:NewerGrid, it is not related to who is the sender/receiver
        const usersArray = [createSucData.senderGrcpAlias, createSucData.receiverGrcpAlias].sort();

        // Sending a new content message to the receiving user.
        const sendContentData = {
            clientRequestId: randomUUID(),
            conversationId: `d:${usersArray[0]}:${usersArray[1]}:`,
            content: createSucData.content,
            msgType: 'conversation.ServerSendContentMsg'
        };
        await GrcpBaseController.sendRequest(page, sendContentData);
    }

    /**
     * Create a new MUC conversation between an array of users via grcp calls.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param CreateMucData Data about the MUC.
     * @param CreateMucData.subject Subject of the MUC.
     * @param CreateMucData.participantsGrcpAliases Grcp aliases of the participants.
     */
    static async createMUC(page: Page, createMucData: CreateMucDataType) {
        // Convert participants into required format
        const listOfParticipants = createMucData.participantsGrcpAliases.map((participantGrcpAlias) => {
            return {
                userId: participantGrcpAlias
            };
        });

        //Start MUC conversation between a list of users.
        const mucData = {
            clientRequestId: randomUUID(),
            subject: createMucData.subject,
            participants: listOfParticipants,
            msgType: 'conversation.ServerCreateConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, mucData);
    }

    /**
    * Create a new Channel conversation.
    * This grcp call creates an empty channel without moderators and participants. 
    * To invite participants to a Open channel, use 'inviteParticipantToChannel' method from grcp-controller
    * To invite moderators/participants to a Restricted/Business channel, 
    * use 'addUserToChannelModeratorList/addUserToChannelParticipantList' method from grcp-controller,
    * then use 'inviteParticipantToChannel' to send an invite.

    * @param page Page object that contains the message-iframe for use to make the grcp call.
    * @param createChannelData Data about the channel.
    * @param createChannelData.name Name of the Channel.
    * @param createChannelData.subject Subject of the Channel.
    * @param createChannelData.description Description of the Channel
    * @param createChannelData.type Type of the Channel. It can only be one of the three: 'company_unrestricted' | 'company_restricted' | 'business'

    */
    static async createChannel(page: Page, createChannelData: CreateChannelDataType) {
        //Create channel conversation.
        const channelData = {
            clientRequestId: randomUUID(),
            companyIds: createChannelData.companyIds,
            description: createChannelData.description,
            name: createChannelData.name,
            subject: createChannelData.subject,
            type: createChannelData.type,
            msgType: 'channel.ServerCreateChannelMsg'
        };
        await GrcpBaseController.sendRequest(page, channelData);
    }
}
