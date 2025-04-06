const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 8 characters)
 *                 example: "Password@1234"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: Unique identifier for the created user
 *                   example: "67f1baf52a3038f09ad2fed0"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdmMWJhZjUyYTMwMzhmMDlhZDJmZWQwIn0sImlhdCI6MTc0Mzg5NTI4NSwiZXhwIjoxNzQzODk4ODg1fQ.fUoSy7wOVvu1aDpIGUbaW_m1NPpjlt_1SSCHJHe9fgk"
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User already exists"
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "Password@1234"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3ZDVhODYwOTMzNWM4ZTZlMTIwMTNjYyJ9LCJpYXQiOjE3NDM3ODMzMDgsImV4cCI6MTc0MzgwNDkwOH0.BgK3olSZ-KrfzxuKzTvHoH4RLRvQoTJybyareGwAZ5E"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "67d5a8609335c8e6e12013cc"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     description: Retrieves the profile data for the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                   example: "67f1baf52a3038f09ad2fed0"
 *                 name:
 *                   type: string
 *                   description: User's name
 *                   example: "bhargav"
 *                 email:
 *                   type: string
 *                   description: User's email
 *                   example: "bhuvan.s@northeastern.edu"
 *                 groups:
 *                   type: array
 *                   description: IDs of groups the user belongs to
 *                   items:
 *                     type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: User creation timestamp
 *                   example: "2025-04-05T23:21:25.850Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: User last update timestamp
 *                   example: "2025-04-05T23:21:25.850Z"
 *                 __v:
 *                   type: integer
 *                   description: Version key
 *                   example: 0
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 */
router.get('/profile', auth, userController.getProfile);

/**
 * @swagger
 * /api/users/{user_id}:
 *   get:
 *     summary: Get user details by ID
 *     description: Retrieves detailed information about a specific user by their ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *         example: "67f1baf52a3038f09ad2fed0"
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                   example: "67f1baf52a3038f09ad2fed0"
 *                 name:
 *                   type: string
 *                   description: User's name
 *                   example: "bhargav"
 *                 email:
 *                   type: string
 *                   description: User's email
 *                   example: "bhuvan.s@northeastern.edu"
 *                 groups:
 *                   type: array
 *                   description: IDs of groups the user belongs to
 *                   items:
 *                     type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: User creation timestamp
 *                   example: "2025-04-05T23:21:25.850Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: User last update timestamp
 *                   example: "2025-04-05T23:21:25.850Z"
 *                 __v:
 *                   type: integer
 *                   description: Version key
 *                   example: 0
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/:user_id', auth, userController.getUser);

/**
 * @swagger
 * /api/users/{user_id}:
 *   put:
 *     summary: Update user details
 *     description: Updates information for a specific user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user to update
 *         example: "67d5a8609335c8e6e12013cc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's updated name
 *                 example: "fair share"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's updated email
 *                 example: "updated@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                   example: "67d5a8609335c8e6e12013cc"
 *                 name:
 *                   type: string
 *                   description: User's updated name
 *                   example: "fair share"
 *                 email:
 *                   type: string
 *                   description: User's email
 *                   example: "bhuvanam.s@northeastern.edu"
 *                 password_hash:
 *                   type: string
 *                   description: Hashed password
 *                   example: "$2b$10$2YJNWVh5s2lF0pusgC0yMeLzcXoMvxWwOPZIXLc7So5/3FZbeKQHO"
 *                 groups:
 *                   type: array
 *                   description: IDs of groups the user belongs to
 *                   items:
 *                     type: string
 *                   example: ["67d5ad9e3cc22e833a11dd32", "67f05874ba42616a93d7cf37", "67f058f9ba42616a93d7cfab"]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: User creation timestamp
 *                   example: "2025-03-15T16:18:40.857Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: User last update timestamp
 *                   example: "2025-03-15T16:18:40.858Z"
 *                 __v:
 *                   type: integer
 *                   description: Version key
 *                   example: 3
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 */
router.put('/:user_id', auth, userController.updateUser);

/**
 * @swagger
 * /api/users/{user_id}/summary:
 *   get:
 *     summary: Get user financial summary
 *     description: Retrieves financial summary including balances across all groups for a specific user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *         example: "67d5a8609335c8e6e12013cc"
 *     responses:
 *       200:
 *         description: Financial summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupBalances:
 *                   type: array
 *                   description: Financial balances for each group
 *                   items:
 *                     type: object
 *                     properties:
 *                       group_id:
 *                         type: string
 *                         description: Group identifier
 *                         example: "67d5ad9e3cc22e833a11dd32"
 *                       group_name:
 *                         type: string
 *                         description: Name of the group
 *                         example: "test group"
 *                       total_owed:
 *                         type: number
 *                         description: Total amount owed by user to others in this group
 *                         example: 0
 *                       total_to_receive:
 *                         type: number
 *                         description: Total amount to be received by user from others in this group
 *                         example: 2006.6666666666667
 *                       owes_to:
 *                         type: array
 *                         description: Details of amounts owed to other users
 *                         items:
 *                           type: object
 *                           properties:
 *                             user_id:
 *                               type: string
 *                               description: User ID of the person owed money to
 *                             amount:
 *                               type: number
 *                               description: Amount owed
 *                       gets_from:
 *                         type: array
 *                         description: Details of amounts to be received from other users
 *                         items:
 *                           type: object
 *                           properties:
 *                             user_id:
 *                               type: string
 *                               description: User ID of the person who owes money
 *                               example: "67d5ace83cc22e833a11dd2d"
 *                             amount:
 *                               type: number
 *                               description: Amount to be received
 *                               example: 1003.3333333333334
 *                 name:
 *                   type: string
 *                   description: User's name
 *                   example: "bhargav"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/:user_id/summary', auth, userController.getUserSummary);

/**
 * @swagger
 * /api/users/{user_id}/investments/summary:
 *   get:
 *     summary: Get user investment summary
 *     description: Retrieves investment summary across all groups for a specific user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *         example: "67d5a8609335c8e6e12013cc"
 *     responses:
 *       200:
 *         description: Investment summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: User identifier
 *                   example: "67d5a8609335c8e6e12013cc"
 *                 name:
 *                   type: string
 *                   description: User's name
 *                   example: "bhargav"
 *                 groupContributions:
 *                   type: array
 *                   description: Investment contributions across groups
 *                   items:
 *                     type: object
 *                     properties:
 *                       group_id:
 *                         type: string
 *                         description: Group identifier
 *                       group_name:
 *                         type: string
 *                         description: Name of the group
 *                       total_contributed:
 *                         type: number
 *                         description: Total amount contributed to investments in this group
 *                       investments:
 *                         type: array
 *                         description: Details of individual investments
 *                         items:
 *                           type: object
 *                           properties:
 *                             investment_id:
 *                               type: string
 *                               description: Investment identifier
 *                             name:
 *                               type: string
 *                               description: Investment name
 *                             amount:
 *                               type: number
 *                               description: Amount contributed to this investment
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Token is not valid"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not found"
 */
router.get('/:user_id/investments/summary', auth, userController.getInvestmentSummary);

module.exports = router;