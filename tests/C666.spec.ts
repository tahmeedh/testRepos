import { test } from '@playwright/test';
import { Company } from 'Apis/company';
// import { UserUtils } from 'Apis/sm/helpers/user-utils';
test('C666', async () => {
    const company = new Company();
    try {
        // const [user1, user2, user3] = await UserUtils.createCompanyAndUsers(3, company)
        // await user1.updateJobTitle('test job title')
        // console.log(await user1.getUserProfile())
        //     await user1.removeCompanyEntitlement()
        //     await user1.removeFileSharingEntitlement()
        //     await user1.removeInstantMessageEntitlement()
        //     await user1.removeManageBusinessChannelsEntitlement()
        //     await user1.removeManageCompanyChannelsEntitlement()
        //     await user1.removeMessageApplicationEntitlement()
        //     await user1.removePublicEntitlement()
        //     await user1.addCompanyEntitlement()
        //     await user1.addFileSharingEntitlement()
        //     await user1.addInstantMessageEntitlement()
        //     await user1.addManageBusinessChannelsEntitlement()
        //     await user1.addManageCompanyChannelsEntitlement()
        //     await user1.addMessageApplicationEntitlement()
        //     await user1.addPublicEntitlement()
        //     await user1.assignMessageAdminRole()
        //     await user1.assignSMSUserWithCallForwardRole()
        //     await user1.unassignSMSUserWithCallForwardRole()
        //     await user1.unassignMessageAdminRole()
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await company.deleteCompany();
    }
});
