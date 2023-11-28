import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class MinLettersConstraint implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments): boolean {
      const minLetters = args.constraints[0];
      const lettersCount = (text.match(/[a-zA-Z]/g) || []).length;
      return lettersCount >= minLetters;
    }
  
    defaultMessage(args: ValidationArguments): string {
      return `Поле должно содержать не меньше ${args.constraints[0]} букв.`;
    }
  }
  
  export function minLetters(
    minLetters: number,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [minLetters],
        validator: MinLettersConstraint,
      });
    };
  }
  