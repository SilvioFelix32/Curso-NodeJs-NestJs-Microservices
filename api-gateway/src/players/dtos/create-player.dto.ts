import { IsNotEmpty, IsEmail } from 'class-validator'

export class CreatePlayerDto {

    @IsNotEmpty()
    readonly celPhone: string;

    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly category: string;
}
