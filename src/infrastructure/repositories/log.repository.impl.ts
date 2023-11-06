import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repositories/log.repository";

export class LogRepositoryIMPL extends LogRepository {

    constructor(
        private readonly logDataSource: LogDataSource
    ) {
        super();
    }

    async saveLog(log: LogEntity): Promise<void> {
        return this.logDataSource.saveLog(log);
    }

    async getLogs(securityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        return this.logDataSource.getLogs(securityLevel);
    }
}