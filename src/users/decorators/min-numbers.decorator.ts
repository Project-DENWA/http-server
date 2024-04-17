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
    return `Field must contain at least ${args.constraints[0]} number(s).`;
  }
}

export function minNumbers(
  minNumbers: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minNumbers],
      validator: MinNumbersConstraint,
    });
  };
}
