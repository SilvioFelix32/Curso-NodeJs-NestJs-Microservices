import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
    phoneNumber: String,
    email: { type: String, unique: true },
    name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ranking: String,
    rankingPosition: Number,
    urlPlayerPicture: String,
}, { timestamps: true, collection: 'players' })