import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class GlobalValidationPipe implements PipeTransform {
  private readonly maxPayloadSize = 1024 * 1024; // 1MB

  async transform(value: any, metadata: ArgumentMetadata) {
    // Check payload size
    const payloadSize = JSON.stringify(value).length;
    if (payloadSize > this.maxPayloadSize) {
      throw new BadRequestException(`Payload size exceeds maximum allowed size of ${this.maxPayloadSize} bytes`);
    }

    // Validate against DTO if available
    if (!value || typeof value !== 'object') {
      return value;
    }

    if (metadata.type !== 'body' || !metadata.metatype) {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => {
          return `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`;
        })
        .join('; ');

      throw new BadRequestException(errorMessages);
    }

    return object;
  }
}
