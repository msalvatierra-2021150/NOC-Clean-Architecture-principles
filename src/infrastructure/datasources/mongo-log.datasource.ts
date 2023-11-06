import { LogModel } from "../../data/mongo";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogDataSource } from "../../domain/datasources/log.datasource";

export class MongoLogDatasource implements LogDataSource {

    /** We create a new MongoDB record from a LogEntity object. */
    async saveLog(log: LogEntity): Promise<void> {

        const newLog = await LogModel.create(log);
        console.log('Mongo Log created:', newLog.id);
    }

    /** We get all logs from MongoDB as an array of MongoDB records, then we loop
     * the array, and in every loop we parse them into a LogEntity Object. */
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        });
        return logs.map(mongoLog => LogEntity.fromObject(mongoLog));
    }
}