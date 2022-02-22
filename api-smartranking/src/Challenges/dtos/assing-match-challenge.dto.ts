import { IsNotEmpty } from "class-validator";
import { Player } from "src/Players/interfaces/player.interface";
import { Result } from '../interfaces/challenges.interface'

export class AssingMatchChallengeDto {
    @IsNotEmpty()
    def: Player

    @IsNotEmpty()
    result: Array<Result>
}