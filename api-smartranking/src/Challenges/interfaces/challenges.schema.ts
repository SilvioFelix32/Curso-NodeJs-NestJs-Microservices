import * as moongose from 'mongoose';

export const ChallengeSchema = new moongose.Schema({
    dateTimeChallenge: { type: Date },
    status: { type: String },
    dateTimeSolicitation: { type: Date },
    dateTimeResponse: { type: Date },
    requester: { type: moongose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [{
        type: moongose.Schema.Types.ObjectId, ref: 'Player'
    }],
    match: {
        type: moongose.Schema.Types.ObjectId, ref: 'Match'
    }
}, { timestamps: true, collection: 'desafios' })