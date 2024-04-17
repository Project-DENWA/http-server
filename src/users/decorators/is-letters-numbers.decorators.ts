import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsLettersNumbersConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean {
    // A regular expression that checks that the string contains only numbers and English letters
    const regex = /^[A-Za-z0-9]+$/;
    return typeof value === 'string' && regex.test(value);
  }
}

export function IsLettersNumbers(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLettersNumbersConstraint,
    });
  };
}
