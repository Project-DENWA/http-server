import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";


interface UserCreateAttrs {
    fio: string;
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreateAttrs> {
    @ApiProperty({ example: '21', description: 'id пользователя' })
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique: true })
    id: Number;

    @ApiProperty({ example: 'example@mail.ru', description: 'Логин пользователя' })
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @ApiProperty({ example: 'IVANOV IVAN IVANOVICH', description: 'ФИО пользоватлея' })
    @Column({ type: DataType.STRING, allowNull: false })
    fio: string;

    //idResume: string;

    @ApiProperty({ example: "Ge32j3g", description: 'Пароль пользователя' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: true, description: 'Флаг верификации почты пользователя' })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isEmailVerified: boolean;

    @ApiProperty({ example: 'nf32uy798b&r23f', description: 'Токен активации почты' })
    @Column({ type: DataType.STRING, allowNull: true })
    activationToken: string;

    @ApiProperty({ example: '', description: '' })
    @Column({ type: DataType.STRING, allowNull: true })
    activity: string; // Пока хз что это

    @ApiProperty({ example: 2.3, description: 'Рейтинг пользователя' })
    @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
    rating: number;

    @ApiProperty({ example: 'img/first.png', description: 'Путь до изображения аватарки пользователя' })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
    imgUrl: string;

    @ApiProperty({ example: 'img/backgroundProfile.png', description: `Путь до изображения "Стены" пользователя` })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
    backgroundImgUrl: string;
}