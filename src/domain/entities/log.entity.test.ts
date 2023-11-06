import { LogEntity, LogSeverityLevel } from "./log.entity"

describe('LogEntity', () => {
    const dataObject = {
        message: 'Hola mundo',
        origin: 'log.datasource.test.ts',
        level: LogSeverityLevel.high
    }
   test('EShould create a LogEntity instance', () => {

    const log = new LogEntity(dataObject);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObject.message);
    expect(log.origin).toBe(dataObject.origin);
    expect(log.level).toBe(dataObject.level);
    expect(log.createdAt).toBeInstanceOf(Date);
   });

   test('Should create a LogEntity instance from Json', () => {
        const json = '{"message":"Service https://google.com working","level":"low","createdAt":"2023-11-04T15:39:05.488Z","origin":"check-service.ts"}';
        const log = LogEntity.fromJson(json);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log.message).toBe('Service https://google.com working');
        expect(log.origin).toBe('check-service.ts');
        expect(log.level).toBe(LogSeverityLevel.low);
        expect(log.createdAt).toBeInstanceOf(Date);
    });

    test('Should createLogEntity instance from object', () => {
        const log = LogEntity.fromObject(dataObject);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log.message).toBe(dataObject.message);
        expect(log.origin).toBe(dataObject.origin);
        expect(log.level).toBe(dataObject.level);
        expect(log.createdAt).toBeInstanceOf(Date);
    })
});