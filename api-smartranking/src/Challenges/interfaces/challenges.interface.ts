import { Document } from "mongoose";
import { Player } from "src/Players/interfaces/player.interface";

import { ChallengeStatus } from './challenge-status.enum';

export interface Challenges extends Document {
    dateTimeChallenge: Date,
    status: ChallengeStatus,
    dateTimeSolicitation: Date,
    dateTimeResponse: Date,
    requester: string,
    category: string,
    players: Array<Player>,
    match: Match
}
export interface Match extends Document {
    category: string,
    players: Array<Player>,
    def: Player,
    result: Array<Result>
}

export interface Result {
    set: string
}