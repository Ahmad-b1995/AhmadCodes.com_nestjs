import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || exception.message;
        error = responseObj.error || exception.name;
        
        // Handle validation errors with detailed messages
        if (Array.isArray(responseObj.message)) {
          const validationErrors = responseObj.message;
          message = this.formatValidationErrors(validationErrors);
        }
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      
      const dbError = exception as any;
      
      // Handle specific database constraint errors
      if (dbError.code === '23502') { // NOT NULL constraint
        const columnName = dbError.column || 'required field';
        if (columnName === 'image') {
          message = 'Article image is required. Please provide both alt text and image source URL.';
        } else {
          message = `${columnName} is required and cannot be empty.`;
        }
      } else if (dbError.code === '23505') { // UNIQUE constraint
        message = 'A record with this information already exists';
      } else if (dbError.code === '23503') { // FOREIGN KEY constraint
        message = 'Referenced record does not exist';
      } else if (dbError.code === '42703') { // Column does not exist
        message = 'Database schema error. Please contact support.';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      } else if (dbError.code === '22P02') { // Invalid JSON
        message = 'Invalid data format provided';
      } else {
        message = 'Database operation failed';
      }
    } else if (exception instanceof Error) {
      // Handle generic errors
      message = exception.message || 'An unexpected error occurred';
      error = exception.name || 'Error';
    }

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Send user-friendly response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    });
  }

  private formatValidationErrors(errors: string[]): string {
    return errors
      .map(error => {
        // Convert technical validation messages to user-friendly ones
        if (error.includes('image')) {
          if (error.includes('should not be empty')) {
            return 'Article image is required';
          }
          if (error.includes('must be an object')) {
            return 'Article image must contain alt text and source URL';
          }
        }
        if (error.includes('alt')) {
          return 'Image alt text is required';
        }
        if (error.includes('src')) {
          return 'Image source URL is required';
        }
        if (error.includes('title')) {
          return 'Article title is required';
        }
        if (error.includes('content')) {
          return 'Article content is required';
        }
        return error;
      })
      .join(', ');
  }
} 