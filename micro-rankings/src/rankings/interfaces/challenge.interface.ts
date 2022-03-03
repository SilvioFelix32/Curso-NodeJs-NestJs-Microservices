import { ChallengeStatus } from "../challenges-status.enum";

export interface Challenges extends Document {
    _id: string,
    dateTimeChallenge: Date,
    status: ChallengeStatus,
    dateTimeSolicitation: Date,
    dateTimeResponse: Date,
    requester: string,
    category: string,
    match?: string,
    players: string[],
}
