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
      // Регулярное выражение, проверяющее, что в поле есть только латинские буквы и арабские цифры
      const regex = /^[A-Za-z0-9]+$/;
      return typeof value === 'string' && regex.test(value);
    }
  }
  
  export function IsLettersNumbers(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsLettersNumbersConstraint,
      });
    };
  }
  