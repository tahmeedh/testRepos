const consoleColor = {
    FgBlack: '\x1b[30m%s\x1b[0m',
    FgRed: '\x1b[31m%s\x1b[0m',
    FgGreen: '\x1b[32m%s\x1b[0m',
    FgYellow: '\x1b[33m%s\x1b[0m',
    FgBlue: '\x1b[34m%s\x1b[0m',
    FgMagenta: '\x1b[35m%s\x1b[0m',
    FgCyan: '\x1b[36m%s\x1b[0m',
    FgWhite: '\x1b[37m%s\x1b[0m',
    FgGray: '\x1b[90m%s\x1b[0m',
    BgBlack: '\x1b[40m%s\x1b[0m',
    BgRed: '\x1b[41m%s\x1b[0m',
    BgGreen: '\x1b[42m%s\x1b[0m',
    BgYellow: '\x1b[43m%s\x1b[0m',
    BgBlue: '\x1b[44m%s\x1b[0m',
    BgMagenta: '\x1b[45m%s\x1b[0m',
    BgCyan: '\x1b[46m%s\x1b[0m',
    BgWhite: '\x1b[47m%s\x1b[0m',
    BgGray: '\x1b[100m%s\x1b[0m'
};

export class Log {
    static async info(message: string) {
        console.info(message);
    }

    static async success(message: string) {
        console.info(consoleColor.FgGreen, `SUCCESS: ${message}`);
    }

    static async error(message: string, error) {
        console.error(consoleColor.FgRed, `ERROR: ${message} - ${error}`);
    }

    static async warn(message: string) {
        console.warn(consoleColor.FgYellow, `WARNING: ${message}`);
    }

    static async highlight(message: string) {
        console.info(consoleColor.BgGray, message);
    }

    static async equalsDivider(message: string) {
        console.info(consoleColor.FgGray, `===================== ${message} =====================`);
    }

    static async starDivider(message: string) {
        console.info(consoleColor.BgBlue, `********************* ${message} **********************`);
    }
}
