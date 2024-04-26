import { Router } from 'express';

import { login, logout, signup } from '../Auth/controller';

/**
 * @swagger
 * components:
 *  schemas:
 *    DefaultApiResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          example: success
 *    TokenApiResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          example: success
 *        token:
 *          type: string
 *          example: An authentication token
 *        data:
 *          type: object
 *          properties:
 *            user:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  example: Anakin
 *                lastName:
 *                  type: string
 *                  example: Skywalker
 *                email:
 *                  type: string
 *                  example: a.skywalker@gmail.com
 *    FailedApiResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          example: fail
 *        message:
 *          type: string
 *          example: Description of the error
 *    User:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *          example: Anakin
 *        lastName:
 *          type: string
 *          example: Skywalker
 *        email:
 *          type: string
 *          example: a.skywalker@gmail.com
 *        password:
 *          type: string
 *          example: Dont_like_sand_4
 *        passwordConfirm:
 *          type: string
 *          example: Dont_like_sand_4
 *    TestUser:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          example: tester@gmail.com
 *        password:
 *          type: string
 *          example: test1234
 *  requestBodies:
 *    User:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    TestUser:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/TestUser'
 *  responses:
 *    200Simple:
 *      description: Successful request
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/DefaultApiResponse'
 *    200Token:
 *      description: Successful request
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TokenApiResponse'
 *    400BadRequest:
 *      description: Bad request error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/FailedApiResponse'
 *    401Validation:
 *      description: Validation error
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FailedApiResponse'
 */

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
