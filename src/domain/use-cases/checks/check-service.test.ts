import { LogEntity } from "../../entities/log.entity";
import { CheckService } from "./check-service"

describe('check-service.test.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRepository = {
        saveLog: jest.fn(),
        getLogs: jest.fn()
    }

    const successCallback = jest.fn();
    const errorCallback = jest.fn();

    const checkService = new CheckService(
        mockRepository,
        successCallback,
        errorCallback
    );

   test('Should call successCallback when fetch returns true', async() => {

        const url = 'https://google.com';
        const wasOk = await checkService.execute(url);

        expect(wasOk).toBeTruthy();
        expect(successCallback).toHaveBeenCalled();
        expect(errorCallback).not.toHaveBeenCalled();

        expect(mockRepository.saveLog).toHaveBeenCalledWith(
            expect.any(LogEntity)
        );
   });

   test('Should call errorCallback when fetch returns false', async() => {
        const url = 'https://google.con';
        const wasOk = await checkService.execute(url);

        expect(wasOk).toBeFalsy();
        expect(successCallback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalled();

        expect(mockRepository.saveLog).toHaveBeenCalledWith(
            expect.any(LogEntity)
        );
    });
});