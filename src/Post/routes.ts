import { Router } from 'express';

import {
  checkPostsExistance,
  checkPostsOwner,
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  toggleLike,
  updatePost,
  uploadPostImage,
} from './controller';
import { protect } from '../Auth/controller';
import { ToggleLikeActionType } from './types';

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
 *    Post:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          example: PostId
 *        user:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: UserId
 *           firstName:
 *              type: string
 *              example: Mike
 *           lastName:
 *              type: string
 *              example: Wazowsky
 *        text:
 *          type: string
 *          example: What a great view!
 *        images:
 *          type: array
 *          example: []
 *        likes:
 *          type: array
 *          example: []
 *  parameters:
 *    postId:
 *      name: postId
 *      in: path
 *      description: An id of a post to like
 *      required: true
 *      schema:
 *        type: string
 *        example: 662ada4c46b73e708e2458b8
 */

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Posts management
 */
const postRouter = Router();

/**
 * @swagger
 * /v1/posts:
 *   get:
 *     summary: Gets all posts
 *     tags: [Post]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfull request
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 *   post:
 *     summary: Creates a new post
 *     tags: [Post]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Successfully created a post
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 */
postRouter
  .route('/')
  .get(protect, getAllPosts)
  .post(protect, uploadPostImage, createPost);

/**
 * @swagger
 * /v1/posts/{postId}:
 *   get:
 *     summary: Gets a post by id
 *     tags: [Post]
 *     produces:
 *       - application/json
 *     parameters:
 *      - $ref: '#/components/parameters/postId'
 *     responses:
 *       200:
 *         description: Successfully gotten all posts
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 *   patch:
 *     summary: Updates a post by id
 *     tags: [Post]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Successfull request
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 *   delete:
 *     summary: Deletes a post with given id
 *     tags: [Post]
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Successfull request
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 */
postRouter
  .route('/:id')
  .get(protect, getPost)
  .patch(
    protect,
    checkPostsExistance,
    checkPostsOwner,
    uploadPostImage,
    updatePost,
  )
  .delete(protect, checkPostsExistance, checkPostsOwner, deletePost);

/**
 * @swagger
 * /v1/posts/{postId}/like:
 *   patch:
 *     summary: Adds like to a post with given id
 *     tags: [Post]
 *     produces:
 *      - application/json
 *     parameters:
 *      - $ref: '#/components/parameters/PostId'
 *     responses:
 *       200:
 *         description: Successfull request
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 */
postRouter
  .route('/:id/like')
  .patch(protect, toggleLike(ToggleLikeActionType.like));

/**
 * @swagger
 * /v1/posts/{postId}/unlike:
 *   patch:
 *     summary: Removes like from a post with given id
 *     tags: [Post]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfull request
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/TokenApiResponse'
 */
postRouter
  .route('/:id/unlike')
  .patch(protect, toggleLike(ToggleLikeActionType.unlike));

export default postRouter;
