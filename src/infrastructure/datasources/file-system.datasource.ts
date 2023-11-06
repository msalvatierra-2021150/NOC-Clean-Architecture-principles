import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from 'fs';

export class FileSystemDataSource implements LogDataSource {
    private readonly logPath = 'logs/';
    private readonly allLogsPath    = 'logs/logs-low.log';
    private readonly mediumLogsPath = 'logs/logs-medium.log'
    private readonly highLogsPath   = 'logs/logs-high.log'

    constructor() {
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.allLogsPath)) {
            fs.mkdirSync(this.logPath);
        }

        /** Takes all the paths and creates the dir if not exists */
        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach(path => {
            if (fs.existsSync(path)) return;
            fs.writeFileSync(path, '');
        })
    }
    /** We delete all \n and leave the stingified clean Json and check if the file is empty */
    private getLogsFromFile = (path: string): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf8');

        if (content === '') return [];

        const logs = content.split('\n').map(
            log => LogEntity.fromJson(log)
        );
        return logs;
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify(newLog)}\n`
        // We save the logs similar to JSON format
        fs.appendFileSync(this.allLogsPath, logAsJson);

        if (newLog.level === LogSeverityLevel.low) return;

        // We save the logs similar to JSON format in the medium dir
        if (newLog.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, logAsJson);
        } else {
            // We save the logs similar to JSON format in the high dir
            fs.appendFileSync(this.highLogsPath, logAsJson);
        }
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogsPath);
            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);
            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath);
            default:
                throw new Error(`${severityLevel} not implemented`);
        }
    }

}