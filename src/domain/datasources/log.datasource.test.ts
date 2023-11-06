import { mock } from "node:test";
import { LogEntity, LogSeverityLevel } from "../entities/log.entity"
import { LogDataSource } from "./log.datasource"

describe('log.datasource.ts LogDataSource', () => {
    const newLog = new LogEntity({
        origin: 'log.datasource.test.ts',
        message: 'test-message',
        level: LogSeverityLevel.low
    })

    class MockLogDataSource implements LogDataSource {
        async saveLog(log: LogEntity): Promise<void> {
            return;
        }
        async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
            return [newLog];
        }
    }

   test('Should test the abstract class', async() => {
        const mockLogDataSource = new MockLogDataSource();

        expect(mockLogDataSource).toBeInstanceOf(MockLogDataSource);
        expect(typeof mockLogDataSource.getLogs).toBe('function');
        expect(typeof mockLogDataSource.saveLog).toBe('function');

        await mockLogDataSource.saveLog(newLog);

        const logs = await mockLogDataSource.getLogs(LogSeverityLevel.low);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toBeInstanceOf(LogEntity);
    });
});