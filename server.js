import express from "express";
import authController from "./src/controllers/AuthController.js";
import taskController from "./src/controllers/TaskController.js";
import connectDb from "./src/config/db.js";

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

connectDb();

app.use(express.json({ extended: false, limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/auth', authController);
app.use('/api/tasks', taskController);

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));