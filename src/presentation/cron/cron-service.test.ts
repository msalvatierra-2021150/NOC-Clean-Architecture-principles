import { CronService } from "./cron-service";

describe('CronService', () => {
   test('Should create a job', (done) => {

    const mockTick = jest.fn();

    const job = CronService.createJob('* * * * * *', mockTick);

    setTimeout(() => {
        expect(mockTick).toHaveBeenCalledTimes(2);
        job.stop();
        done();
    }, 2000)
   });
});