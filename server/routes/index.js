const express = require('express')
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
require("../auth/passportJwt");

// # HTTP 요청 메서드
// GET: read data
// POST: create data
// PUT: update data
// DELETE: delete data

// router.HttpRequestMethod(endPoint, controller)
router.get('/', (req, res) => {
  res.json({ message: "hello express" })
})

const auth_controller = require('../controllers/auth_controller');
const account_controller = require('../controllers/account_controller');
const article_controller = require('../controllers/article_controller');
const comment_controller = require('../controllers/comment_controller');
const search_controller = require('../controllers/search_controller');
const profile_controller = require('../controllers/profile_controller');

// # AUTH
router.get('/user', auth, auth_controller.user);

// ACCOUNTS (계정)
router.post('/accounts/login', account_controller.login);
router.post('/accounts/register', account_controller.register);
router.post('/accounts/edit', auth, account_controller.edit);
router.post('/accounts/edit/image', auth, account_controller.upload_image)
router.delete('/accounts/edit/image', auth, account_controller.delete_image);

// ARTICLES (게시물)
router.post('/articles', auth, article_controller.create);
router.get('/articles', auth, article_controller.article_list);
router.get('/articles/:id', auth, article_controller.article);
router.delete('/articles/:id', auth, article_controller.delete);
router.post('/articles/:id/favorite', auth, article_controller.favorite);
router.delete('/articles/:id/favorite', auth, article_controller.unfavorite);
router.get('/feed', auth, article_controller.feed);

// COMMENTS (댓글)
router.post('/articles/:id/comments', auth, comment_controller.create);
router.get('/articles/:id/comments', auth, comment_controller.comment_list)
router.delete('/comments/:id', auth, comment_controller.delete);
router.post('/comments/:id/favorite', auth, comment_controller.favorite);
router.delete('/commments/:id/favorite', auth, comment_controller.unfavorite);

// SEARCH (검색)
router.get('/search', auth, search_controller.username);

// PROFILE (프로필)
router.get('/profiles/:username', auth, profile_controller.profile);
router.get('/profiles/:username/articles', auth, profile_controller.timeline)
router.post('/profiles/:username/follow', auth, profile_controller.follow);
router.delete('/profiles/:username/follow', auth, profile_controller.unfollow);
router.get('/profiles/:username/followers', auth, profile_controller.follower_list)
router.get('/profiles/:username/following', auth, profile_controller.following_list)
module.exports = router;