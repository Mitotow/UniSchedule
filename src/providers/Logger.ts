import fs from 'fs';
import path from 'path';

export default class Logger {
    private static instance : Logger | null = null;
    private date = new Date(Date.now());
    private pdir = path.join(__dirname, '../../logs');
    private plog = path.join(this.pdir, `log-${this.date.toJSON()}.log`);
    private types = {
        info: ["\u001b[34mINFO\u001b[39m", "INFO"],
        trace: ["\u001b[32mTRACE\u001b[39m", "TRACE"],
        debug: ["\u001b[90mDEBUG\u001b[39m", "DEBUG"],
        warn: ["\u001b[91mWARN\u001b[39m", "WARN"],
        error: ["\u001b[31mERROR\u001b[39m", "ERROR"],
    }

    constructor() {this.init()}

    private init() {
        if(!fs.existsSync(this.pdir)) {
            fs.mkdirSync(this.pdir);
        }
        fs.writeFileSync(this.plog, '');
    }

    /**
     * 
     * @returns Logger instance
     */
    public static getInstance(): Logger {
        if(!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * 
     * @param str - Message
     */
    public info(...str:string[]):void {
        this.write(this.types.info, str.join(' '));
    }

    /**
     * 
     * @param str - Message
     */
    public trace(...str : string[]): void {
        const error = new Error(str.join(' '));
        error.name = '';
        
        if(error.stack) {
            const lines = error.stack.split('\n');
            const filteredLines = lines.filter(line => !line.includes('Logger.trace'));
            const stack = filteredLines.join('\n');

            this.write(this.types.trace, stack);
        }
        else
            this.write(this.types.trace, 'No stack found');
    }

    /**
     * 
     * @param str - Message
     */
    public warn(...str : string[]): void {
        this.write(this.types.warn, str.join(' '));
    }

    /**
     * 
     * @param err - Error
     */
    public error(err:any) {
        if(err instanceof Error) {
            this.write(this.types.error, err.stack?err.stack.split('\n').join('\n\t'):`${err.name}: ${err.message}`);
        } else {
            this.write(this.types.error, err);
        }
    }

    private write(type:string[], ...str:string[]): void {
        const message = str.join(' ');
        const date = this.getDateString();
        console.log(`[${date}] [${type[0]}] ${message}`);
        fs.writeFileSync(this.plog, `[${date}] [${type[1]}] ${message}`);
    }

    private getDateString(): string {
        const parisTimeZone = 'Europe/Paris';
        const d = new Date();
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            timeZone: parisTimeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const [{ value: day }, , { value: month }, , { value: year }, , { value: hour }, , { value: minute }, , { value: second }] = formatter.formatToParts(d);
        
        return `${day}/${month}/${year}-${hour}:${minute}:${second}`;
    }

}