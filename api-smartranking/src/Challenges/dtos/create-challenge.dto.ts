import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Player } from "src/Players/interfaces/player.interface";

export class CreateChallengeDto {
    @IsNotEmpty()
    @IsDateString()
    dateTimeChallenge: Date;

    @IsNotEmpty()
    requester: Player;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<Player>
}