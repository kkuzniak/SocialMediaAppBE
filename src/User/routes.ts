import { Router } from 'express';

import { login, logout, signup } from '../Auth/controller';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Account management
 */
const userRouter = Router();

/**
 * @swagger
 * /v1/users/signup:
 *   post:
 *     summary: Signs up a new user
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/User'
 *     responses:
 *      200:
 *        $ref: '#/components/responses/200Token'
 *      400:
 *        $ref: '#/components/responses/400BadRequest'
 *      401:
 *        $ref: '#/components/responses/401Validation'
 */
userRouter.post('/signup', signup);

/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [User]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/TestUser'
 *     responses:
 *      200:
 *         $ref: '#/components/responses/200Token'
 *      401:
 *        $ref: '#/components/responses/401Validation'
 */
userRouter.post('/login', login);

/**
 * @swagger
 * /v1/users/logout:
 *   get:
 *     summary: Logs out a user
 *     tags: [User]
 *     produces:
 *      - application/json
 *     responses:
 *      200:
 *        $ref: '#/components/responses/200Simple'
 *      401:
 *        $ref: '#/components/responses/401Validation'
 */
userRouter.get('/logout', logout);

export default userRouter;
