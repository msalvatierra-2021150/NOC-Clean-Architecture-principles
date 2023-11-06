import nodemailer from 'nodemailer'
import { envs } from '../../config/envs.plugin'
import { LogRepository } from '../../domain/repositories/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export interface SendMailOptions {
    to: string | string [],
    subject: string,
    htmlBody: string,
    attachments?: Attachment[];
}

export interface Attachment {
    filename: string,
    path: string
}

export class EmailService {

    constructor(
        private readonly logRepository: LogRepository,
    ) {
    }
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    async sendEmail(options: SendMailOptions):Promise<boolean> {

        const { to, subject, htmlBody, attachments = [] } = options;

        try {
            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });

            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: `Log Email sent`,
                origin: 'email.service.ts'
            });

            this.logRepository.saveLog(log);

            return true;
        } catch (error) {

            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: `Email not sent`,
                origin: 'email.service.ts'
            });

            this.logRepository.saveLog(log);
            return false;
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]) {
        const subject = 'Server logs';
        const htmlBody = `
            <h1>System Logs - NOC </h1>
            <p>Here I attach the system logs</p>
            <p>Check attachments</p>
        `;
        const attachments: Attachment[] = [
            {filename: 'logs-low.log', path: './logs/logs-low.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
            {filename: 'logs-high.log', path: './logs/logs-high.log'}
        ]

        return await this.sendEmail({
            to: to,
            subject: subject,
            htmlBody: htmlBody,
            attachments: attachments
        });
    }
}