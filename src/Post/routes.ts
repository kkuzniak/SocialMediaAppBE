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
 *        $ref: '#/components/responses/200MultiplePosts'
 *   post:
 *     summary: Creates a new post
 *     tags: [Post]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/Post'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200SinglePost'
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
 *      200:
 *        $ref: '#/components/responses/200SinglePostWithUser'
 *      404:
 *        $ref: '#/components/responses/404Post'
 *   patch:
 *     summary: Updates a post with given id
 *     tags: [Post]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *      - $ref: '#/components/parameters/postId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/Post'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200SinglePost'
 *       404:
 *         $ref: '#/components/responses/404Post'
 *   delete:
 *     summary: Deletes a post with given id
 *     tags: [Post]
 *     produces:
 *      - application/json
 *     parameters:
 *      - $ref: '#/components/parameters/postId'
 *     responses:
 *      204:
 *        $ref: '#/components/responses/204'
 *      404:
 *        $ref: '#/components/responses/404Post'
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
 *      - $ref: '#/components/parameters/postId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200LikedPost'
 *       404:
 *         $ref: '#/components/responses/404Post'
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
 *     parameters:
 *      - $ref: '#/components/parameters/postId'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200UnlikedPost'
 *       404:
 *         $ref: '#/components/responses/404Post'
 */
postRouter
  .route('/:id/unlike')
  .patch(protect, toggleLike(ToggleLikeActionType.unlike));

export default postRouter;
