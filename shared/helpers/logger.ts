/* eslint-disable no-console */
const Reset = '\x1b[0m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';

export default class Logger {
    private static stringify(obj: any) {
        const seen = new WeakSet();

        return JSON.stringify(
            obj,
            (_, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) return '[Circular]';
                    seen.add(value);
                }

                return value;
            },
            2
        );
    }

    private static getTimestamp(): string {
        const now = new Date();
        return `[${now.toISOString().replace('T', ' ').slice(0, -5)}]`;
    }

    private static say(color: string, msg: any): void {
        const timestamp = Logger.getTimestamp();
        console.log(`${color}${timestamp} ${Logger.stringify(msg)}${Reset}`);
    }

    static warning(msg: any): void {
        Logger.say(FgYellow, msg);
    }

    static success(msg: any): void {
        Logger.say(FgGreen, msg);
    }

    static error(msg: any): void {
        Logger.say(FgRed, msg);
    }

    static info(msg: any): void {
        Logger.say(FgBlue, msg);
    }
}
