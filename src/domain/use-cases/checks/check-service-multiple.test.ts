import { LogEntity } from "../../entities/log.entity";
import { CheckServiceMultiple } from "./check-service-multiple"

describe('check-service.test.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRepository1 = {
        saveLog: jest.fn(),
        getLogs: jest.fn()
    }

    const mockRepository2 = {
        saveLog: jest.fn(),
        getLogs: jest.fn()
    }

    const mockRepository3 = {
        saveLog: jest.fn(),
        getLogs: jest.fn()
    }

    const reporistoriesArray = [mockRepository1, mockRepository2, mockRepository3]
    const successCallback = jest.fn();
    const errorCallback = jest.fn();

    const checkService = new CheckServiceMultiple(
        reporistoriesArray,
        successCallback,
        errorCallback
    );

   test('Should call successCallback when fetch returns true', async() => {

        const url = 'https://google.com';
        const wasOk = await checkService.execute(url);

        expect(wasOk).toBeTruthy();
        expect(successCallback).toHaveBeenCalled();
        expect(errorCallback).not.toHaveBeenCalled();

        for (let index = 0; index < reporistoriesArray.length; index++) {
            expect(reporistoriesArray[index].saveLog).toHaveBeenCalledWith(
                expect.any(LogEntity)
            );
        }
   });

   test('Should call errorCallback when fetch returns false', async() => {
        const url = 'https://google.con';
        const wasOk = await checkService.execute(url);

        expect(wasOk).toBeFalsy();
        expect(successCallback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalled();

        for (let index = 0; index < reporistoriesArray.length; index++) {
            expect(reporistoriesArray[index].saveLog).toHaveBeenCalledWith(
                expect.any(LogEntity)
            );
        }
    });
});