import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        min: 1,
        max: 50,
    },
    category: {
        type: String,
        required: true,
    },
    deadline: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('Tasks', TaskSchema);