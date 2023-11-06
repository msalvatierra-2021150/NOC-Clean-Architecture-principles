import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDataSource } from "../infrastructure/datasources/postres-log.datasource";
import { LogRepositoryIMPL } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fsLogRepository = new LogRepositoryIMPL (
    new FileSystemDataSource()
);

const mongoLogRepository = new LogRepositoryIMPL (
    new MongoLogDatasource()
);

const postgresLogRepository = new LogRepositoryIMPL (
    new PostgresLogDataSource()
);

// const emailService = new EmailService(logRepository);

export class Server {
    public static async start() {

        //Send email
        console.log('Server Started');

        // new SendEmailLogs(
        //     emailService,
        //     fileSystemLogRepository
        // )
        // .execute([
        //     "msalvatierra-dev@outlook.com",
        //     "medicsalvatierra@gmail.com"
        // ]);

        // const emailService = new EmailService(fileSystemLogRepository);

        // emailService.sendEmailWithFileSystemLogs([
        //     "msalvatierra-dev@outlook.com",
        //     "medicsalvatierra@gmail.com"
        // ]);

        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'https://google.com';
                new CheckServiceMultiple(
                    [fsLogRepository, mongoLogRepository, postgresLogRepository],
                    () => console.log(`${ url } is ok`),
                    (error) => console.log(error)
                ).execute(url);
                // new CheckService().execute('http://localhost:3000');
            }
        );
    }
}
