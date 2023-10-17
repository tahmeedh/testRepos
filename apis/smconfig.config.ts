import {
    UserProfileAttributeSettingStruct,
    AttributeVisibility,
    AttributeEditability,
    DirectorySettingsStruct
} from 'Apis/sm/directory/thrift-generated/Directory_types';
import { PhoneNumberUtils } from './api-helpers/phoneNumber-utils';
import { UidUtils } from './api-helpers/uid-Utils';

export const USER_DEFAULT_SETTINGS = {
    FIRST_NAME: `auto`,
    LAST_NAME: () => UidUtils.generateStringbyBytes(2),
    PASSWORD: 'Password2@',
    JOB_TITLE: 'job title',
    WORK_PHONE: () => PhoneNumberUtils.randomPhone(),
    MOBILE_PHONE: () => PhoneNumberUtils.randomPhone(),
    HOME_PHONE: () => PhoneNumberUtils.randomPhone(),
    ENTITLEMENTS: [
        'Directory.Public',
        'Directory.ManageCompanyChannels',
        'Directory.ManageBusinessChannels',
        'Directory.FileSharing',
        'Directory.MessageApplication',
        'Directory.InstantMessaging'
    ]
};
/**
 * Settings:
 *  Publish Directory (so users can find each other)
 *  Set all fields in user vcard to the following:
 *      Visibility:   Public
 *      Editable:  Directory
 */

const profilePolicyAttributes = new UserProfileAttributeSettingStruct({
    visibility: AttributeVisibility.PUBLIC,
    editability: AttributeEditability.TIGHT
});

export const COMPANY_DEFAULT_SETTINGS = {
    NAME_PREFIX: `zebra-`,
    NAME: () => UidUtils.generateStringbyBytes(4),
    DIRCTORY_SETTINGS: new DirectorySettingsStruct({
        companyId: null,
        publishUsers: true,
        reportsToSettings: profilePolicyAttributes,
        workPhoneSettings: profilePolicyAttributes,
        homePhoneSettings: profilePolicyAttributes,
        mobilePhoneSettings: profilePolicyAttributes,
        jobTitleSettings: profilePolicyAttributes,
        firstNameSettings: profilePolicyAttributes,
        lastNameSettings: profilePolicyAttributes
    })
};
