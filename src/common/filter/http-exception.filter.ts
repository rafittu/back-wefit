import { AppError } from '../../common/errors/Error';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: AppError = new AppError();

    if (exception instanceof BadRequestException) {
      const hold = (exception.getResponse && exception.getResponse()) as any;
      let message: any = hold?.message ?? (exception as any).message;
      if (Array.isArray(message)) {
        message = message.join(', ');
      }
      error = new AppError('bad.request', HttpStatus.BAD_REQUEST, message);
    } else if (exception instanceof AppError) {
      error = exception;
    }

    response.status(error.code).json({
      error: {
        message: error.message,
        code: error.internalCode,
        status: true,
      },
      data: {},
    });
  }
}
