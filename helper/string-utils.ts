
export class StringUtils {

    generateString(min = 2, max = 15) {
        return Math.random().toString(36).substring(min, max) + Math.random().toString(36).substring(min, max);
    }

}