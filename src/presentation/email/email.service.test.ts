import nodemailer from 'nodemailer';
import { EmailService, SendMailOptions } from './email.service';

describe( 'EmailService', () => {
  const mockSendMail = jest.fn();

  // Mock al createTransport
  nodemailer.createTransport = jest.fn().mockReturnValue( {
    sendMail: mockSendMail
  } );

  const mockLogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn()
  }
  const emailSevice = new EmailService(mockLogRepository);

    test( 'should send email', async () => {

        const options: SendMailOptions = {
        to: 'msalvatierra-dev@outlook.com',
        subject: 'Test',
        htmlBody: '<h1>Test</h1>'
        };

        await emailSevice.sendEmail( options );

        expect( mockSendMail ).toHaveBeenCalledWith( {
        attachments: expect.any( Array ),
        html: "<h1>Test</h1>",
        subject: "Test",
        to: "msalvatierra-dev@outlook.com",
        } );
  } );

  test( 'should send email with attachements', async () => {
    const email = 'fernando@google.com';
    await emailSevice.sendEmailWithFileSystemLogs( email );

    expect( mockSendMail ).toHaveBeenCalledWith( {
        to: email,
        subject: "Server logs",
        html: expect.any( String ),
        attachments: expect.arrayContaining( [
                { filename: 'logs-low.log', path: './logs/logs-low.log' },
                { filename: 'logs-high.log', path: './logs/logs-high.log' },
                { filename: 'logs-medium.log', path: './logs/logs-medium.log' },
        ] )
    } );

  } );

} );