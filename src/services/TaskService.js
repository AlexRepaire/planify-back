import { validationResult } from "express-validator";
import { } from 'dotenv/config';
import Task from "../models/Task.js";

const addTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, deadline, category, completed } = req.body.task;
    try {
        let task = await Task.create({ title, deadline, category, completed });
        if (!task) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Informations' }] })
        }
        return res.status(200).json({ msg: "insert task ok !" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTasks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const category = req.query.category;
    const deadline = req.query?.deadline;
    try {
        let tasks = [];
        if (category == "all" & deadline == undefined || null) {
            tasks = await Task.find();
        } else if (category == "all" && deadline) {
            tasks = await Task.find({ deadline: deadline });
        } else {
            tasks = await Task.find({ category });
        }
        if (!tasks) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Filter' }] })
        }
        console.log(tasks);
        return res.status(200).json(tasks)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, completed } = JSON.parse(JSON.stringify(req.body.task));
    console.log(completed);
    try {
        await Task.findByIdAndUpdate(id, { completed: completed });
        return res.status(200).json({ msg: "ok" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

const deleteTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    try {
        await Task.findByIdAndRemove(id);
        return res.status(200).json({ msg: "ok" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

export default { addTask, getTasks, updateTask, deleteTask };