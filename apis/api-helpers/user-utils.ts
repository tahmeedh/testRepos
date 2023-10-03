import { Company } from 'Apis/company';
import { User } from 'Apis/user';

export class UserUtils {
    static async createCompanyAndUsers(count: 1 | 2 | 3 | 4, company: Company) {
        const company1 = await company.createCompany();
        const listOfUsers = await this.createUsers(count, company1);
        await this.addUserToEachOthersRoster(listOfUsers);
        return listOfUsers;
    }

    static async createUsers(count: 1 | 2 | 3 | 4, company: Company) {
        const arrayOfPromises = [];
        for (let x = 0; x < count; x++) {
            arrayOfPromises.push(company.createUser());
        }
        return Promise.all(arrayOfPromises).then((data: User[]) => {
            return data;
        });
    }

    static async addUserToEachOthersRoster(arrayOfUsers: User[]) {
        const arrayOfPromises = [];
        for (let x = 0; x < arrayOfUsers.length; x++) {
            for (let y = 0; y < arrayOfUsers.length; y++) {
                if (x !== y) {
                    arrayOfPromises.push(arrayOfUsers[x].addUserToRoster(arrayOfUsers[y]));
                }
            }
        }

        await Promise.all(arrayOfPromises);
    }
}
