import { Router } from "express";
import TaskService from "../services/TaskService.js";
import { check, body } from "express-validator";

const router = Router();

/**
 * @route       POST api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.post('/add-task', [
    body("task", "Task is required").exists().isObject(),
], TaskService.addTask);

/**
 * @route       GET api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.get('/tasks', TaskService.getTasks);

/**
 * @route       GET api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.put('/update-task', TaskService.updateTask);

/**
 * @route       GET api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.delete('/delete-task/:id', TaskService.deleteTask);

export default router;