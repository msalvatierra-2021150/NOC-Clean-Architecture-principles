import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface CheckServiceMultipleUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase{

    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ) {

    }

    /** We iterate all dataSources and save the logs */
    private callLogs(log: LogEntity) {
        this.logRepository.forEach(logRepository => {
            logRepository.saveLog(log);
        });
    }

    async execute(url: string): Promise<boolean> {
        try {
            const req = await fetch( url );
            if ( !req.ok ) throw new Error(`Error on check service ${ url }`);

            const log = new LogEntity({
                message: `Service ${url} working`,
                level: LogSeverityLevel.low,
                origin: 'check-service.ts'
            });
            this.callLogs(log);
            //IF success callback is sent then call it
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {
            const errorMessage = `${url} is not okay ${error}`;
            const log = new LogEntity({
                message: errorMessage,
                level: LogSeverityLevel.high,
                origin: 'check-service.ts'
            });
            this.callLogs(log);
            //IF error callback is sent then call it
            this.errorCallback && this.errorCallback(errorMessage);
            return false;
        }
    }
}