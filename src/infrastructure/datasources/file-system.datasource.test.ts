import fs from 'fs';
import path from 'path';
import { FileSystemDataSource } from './file-system.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

describe('file-system.datasource.test.ts', () => {
    const logPath = path.join(__dirname, '../../../logs');

    beforeEach(() => {
        fs.rmSync(logPath, {recursive: true, force: true});
    });

    test('Should create log files if they do not exist', () => {
        new FileSystemDataSource();
        const files = fs.readdirSync(logPath);
        expect(files).toEqual(['logs-high.log', 'logs-low.log', 'logs-medium.log']);
    });

    test('Should save a log in low-logs.log', () => {
        const logDatasource = new FileSystemDataSource();
        const log = new LogEntity({
            level: LogSeverityLevel.low,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);
        const allLogs = fs.readFileSync(`${logPath}/logs-low.log`, 'utf-8');
        expect(allLogs).toContain(JSON.stringify(log));
    });

    test('Should save a log in all logs-low.log and logs-medium.log', () => {
        const logDatasource = new FileSystemDataSource();
        const log = new LogEntity({
            level: LogSeverityLevel.medium,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);
        const lowLogs = fs.readFileSync(`${logPath}/logs-low.log`, 'utf-8');
        const mediumLogs = fs.readFileSync(`${logPath}/logs-medium.log`, 'utf-8');
        expect(lowLogs).toContain(JSON.stringify(log));
        expect(mediumLogs).toContain(JSON.stringify(log));
    });

    test('Should save a log in all logs-low.log and logs-high.log', () => {
        const logDatasource = new FileSystemDataSource();

        const log = new LogEntity({
            level: LogSeverityLevel.high,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);
        const lowLogs = fs.readFileSync(`${logPath}/logs-low.log`, 'utf-8');
        const highLogs = fs.readFileSync(`${logPath}/logs-high.log`, 'utf-8');
        expect(lowLogs).toContain(JSON.stringify(log));
        expect(highLogs).toContain(JSON.stringify(log));
    });

    test('Should return all logs', async() => {
        const logDatasource = new FileSystemDataSource();
        const logLow = new LogEntity({
            level: LogSeverityLevel.low,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        const logMedium = new LogEntity({
            level: LogSeverityLevel.medium,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        const logHigh = new LogEntity({
            level: LogSeverityLevel.high,
            message: 'test',
            origin: 'file-system.datasource.test.ts'
        });

        await logDatasource.saveLog(logLow);
        await logDatasource.saveLog(logMedium);
        await logDatasource.saveLog(logHigh);

        const logsLow = await logDatasource.getLogs(LogSeverityLevel.low);
        const logsMedium = await logDatasource.getLogs(LogSeverityLevel.medium);
        const logsHigh = await logDatasource.getLogs(LogSeverityLevel.high);

        expect(logsLow).toEqual(expect.arrayContaining([logLow, logMedium, logHigh]));
        expect(logsMedium).toEqual(expect.arrayContaining([logMedium]));
        expect(logsHigh).toEqual(expect.arrayContaining([logHigh]));
    });

    test('Should not throw an error if path exists', () => {
        new FileSystemDataSource();
    });

    test('Should throw an error if severity level is not defined', async() => {
        const logDatasource = new FileSystemDataSource();

        const customSeverityLevel = 'SUPER_MEGA_HIGH' as LogSeverityLevel;

        try {
            await logDatasource.getLogs(customSeverityLevel);
            expect(true).toBeFalsy();
        } catch (error) {
            const errorString = `${error}`;
            expect(errorString).toContain(`${customSeverityLevel} not implemented`);
        }
    });
});