import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class MinNumbersConstraint implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments): boolean {
      const minNumbers = args.constraints[0];
      const numbersCount = (text.match(/\d/g) || []).length;
      return numbersCount >= minNumbers;
    }
  
    defaultMessage(args: ValidationArguments): string {
      return `Поле должно содержать не меньше ${args.constraints[0]} цифр.`;
    }
  }
  
  export function minNumbers(
    minNumbers: number,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [minNumbers],
        validator: MinNumbersConstraint,
      });
    };
  }
  