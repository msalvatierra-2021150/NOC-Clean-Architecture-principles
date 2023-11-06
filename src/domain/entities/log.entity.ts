export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export interface LogEntityOptions {
    level: LogSeverityLevel;
    message: string;
    origin: string;
    createdAt?: Date;
}

export class LogEntity {
    public level: LogSeverityLevel;
    public message: string;
    public createdAt: Date;
    public origin: string;

    constructor(options: LogEntityOptions) {
        const { level, message, createdAt = new Date(), origin} = options;
        this.message = message;
        this.level = level;
        this.createdAt = createdAt;
        this.origin = origin;
    }

    /** The logs that were generated as strings but are in json formats */
    static fromJson = (json: string): LogEntity => {
        json = ( json === '' ) ? '{}' : json;

        const { message, level, createdAt, origin } = JSON.parse(json);
        const log = new LogEntity({
            message,
            level,
            createdAt : new Date(createdAt),
            origin: origin,
        });
        log.createdAt = new Date(createdAt);
        return log;
    }

    /** Brings the Json Object and creates new Oject accordding LogEntity, then returns it*/
    static fromObject = (object: {[key: string] : any}) : LogEntity => {
        const {message, level, createdAt, origin} = object;

        const log = new LogEntity({
            message, level, createdAt, origin
        });

        return log;
    }
}