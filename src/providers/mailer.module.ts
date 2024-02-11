import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILDEV_INCOMING_USER as string,
          pass: process.env.MAILDEV_INCOMING_PASS as string,
        },
      },
      defaults: {
        from: `"Denwa" <${process.env.MAILDEV_INCOMING_USER as string}>`,
      },
      template: {
        dir: join(__dirname, '../email-templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
})
export class DIYMailerModule {}
