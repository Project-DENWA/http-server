import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import { IsLettersNumbers } from "../decorators/is-letters-numbers.decorator";
import { minNumbers } from "../decorators/min-numbers.decorator";
import { minLetters } from "../decorators/min-letters.decorator";

export class CreateUserDto {

    @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО пользователя' })
    @IsString({ message: 'Поле ФИО должно быть строкой' })
    readonly fio: string;
    
    @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
    @IsString({ message: 'Поле почта должно быть строкой' })
    @IsEmail({}, { message: 'Некорректное значение поля почты' })
    readonly email: string;
    
    @ApiProperty({ example: 'hdu2ncn126', description: 'User password' })
    @IsString({ message: 'Поле пароль должно быть строкой' })
    @IsLettersNumbers({
      message: 'Пароль должен содержать только латинские буквы и арабские цифры',
    })
    @MinLength(4)
    @minNumbers(1)
    @minLetters(1)
    readonly password: string; 
}