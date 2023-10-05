import { User } from 'Apis/user';

export class UserUtils {
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
