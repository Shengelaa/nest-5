import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
    constructor(private emailService: MailerService){}

    async sendEmailText(to, subject, text){
        const options = {
            from: 'WEB 10 <ketigelovani@gmail.com>',
            to,
            subject,
            text
        }

        const info = await this.emailService.sendMail(options)
        console.log('Email Sent Successfully')
    }

    async sendEmailHtml(to, subject){
        const html = `
            <div style="border: 2px solid black;">
                <h1 style="color: red;">Hello world</h1>
            </div>    
            `
        const options = {
            from: 'WEB 10 <ketigelovani@gmail.com>',
            to,
            subject,
            html
        }

        const info = await this.emailService.sendMail(options)
        console.log('Email Sent Successfully')
    }

}
