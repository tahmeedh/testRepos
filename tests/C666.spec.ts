import { test } from '@playwright/test';
import { Company } from 'Apis/company';
import { User } from 'Apis/user';

test('C666', async () => {
    let company1: Company;
    let user1: User;
    try {
        company1 = await Company.createCompany();
        user1 = await company1.createUser();
        await user1.removeEntitlement('FILE_SHARING');
        await user1.requestAndAssignWhatsAppNumber();
        await user1.unasssignAndReleaseWhatAppNumber();
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await company1.deleteCompany();
    }
});
