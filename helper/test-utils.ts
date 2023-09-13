export class TestUtils {
    static getFileName(fullFilePath: string) {
        const indexOfFileNameStartPosition = fullFilePath.lastIndexOf('/') + 1;
        const indexOfFileNameEndPosition = fullFilePath.indexOf('.spec');
        const fileName = fullFilePath.substring(indexOfFileNameStartPosition, indexOfFileNameEndPosition);
        return fileName;
    }

    static convertPathToTags(fullFilePath: string) {
        const indexOfFilePathStartPosition = fullFilePath.indexOf('tests/') + 5;
        const indexOfFilePathEndPosition = fullFilePath.lastIndexOf('/');
        const filePath = fullFilePath.substring(indexOfFilePathStartPosition, indexOfFilePathEndPosition);
        const tags = filePath.replace(/[/]/g, ' @');
        return tags;
    }

    static getTestID(fullFilePath: string) {
        const fileName = this.getFileName(fullFilePath);
        const indexOfFileNameStartPosition = 1;
        const indexOfFileNameEndPosition = fileName.indexOf('-');
        const testID = fileName.substring(indexOfFileNameStartPosition, indexOfFileNameEndPosition);
        return testID;
    }

    static getTestInfo(fullFilePath: string) {
        return {
            testName: this.getFileName(fullFilePath),
            testTags: this.convertPathToTags(fullFilePath),
            testID: this.getTestID(fullFilePath),
            testAnnotation: this.getAnnotation(fullFilePath)
        };
    }

    static getAnnotation(fullFilePath: string) {
        const testID = this.getTestID(fullFilePath);
        const annotation = {
            type: 'Testcase',
            description: `https://testrail.globalrelay.net/index.php?/cases/view/${testID}`
        };
        return annotation;
    }
}
