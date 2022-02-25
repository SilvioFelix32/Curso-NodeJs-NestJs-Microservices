import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
    category: { type: String, unique: true },
    description: String,
    events: [
        {
            name: String,
            operation: String,
            value: Number,
        }
    ]
}, { timestamps: true, collection: 'categories' })