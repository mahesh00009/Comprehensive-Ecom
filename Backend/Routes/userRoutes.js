const express = require('express')
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../Controllers/UserController')
const { isAuthenticatedUser, authorizedRoles } = require('../Middleware/Auth')

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)

router.route("/logout").get(logout)

router.route("/me").get(isAuthenticatedUser, getUserDetails)

router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers)
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser)

module.exports = router   