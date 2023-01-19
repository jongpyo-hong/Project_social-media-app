const { User, Follow, Article, } = require("../models/model");

// 프로필 정보
exports.profile = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const username = req.params.username;
    const user = await User.findOne({ username });

    // 유저가 존재하지 않을 경우
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    // 로그인 유저가 팔로우하는 유저인지 판단한다
    const follow = await Follow.findOne({ follower: loginUser._id, following: user._id })
    
    // 프로필 유저의 팔로잉 수
    const followingCount = await Follow.countDocuments({ follower: user._id })
    // 프로필 유저의 팔로워 수
    const followersCount = await Follow.countDocuments({ following: user._id })
    // 프로필 유저의 게시물 수
    const articlesCount = await Article.countDocuments({ user: user._id })

    const profile = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      isFollowing: !!follow,
      followersCount,
      followingCount,
      articlesCount
    }

    res.json(profile);

  } catch (error) {
    next(error)
  }
}

// 프로필 유저의 게시물
exports.timeline = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    // 프로필 유저가 존재하지 않는 경우
    if (!user) {
      const err = new Error("User not found")
      err.status = 404;
      return next(err);
    }

    // 쿼리
    const articles = await Article.find({ user: user._id })
      .sort([["created", "descending"]])
      .populate("user")
      .skip(req.query.skip)
      .limit(req.query.limit);

    res.json(articles);

  } catch (error) {
    next(error)
  }
}

// 팔로우
exports.follow = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const username = req.params.username;

    // 쿼리
    const user = await User.findOne({ username })
    const follow = await Follow
      .findOne({ follower: loginUser._id, following: user._id })

    // 로그인 유저가 팔로우 요청을 한 유저를 이미 팔로잉 하고 있을 때
    if (follow) {
      const err = new Error("Already follow");
      err.status = 400;
      return next(err)
    }

    // 새로운 팔로우 데이터를 생성한다
    const newFollow = new Follow({
      follower: loginUser._id,
      following: user._id
    })
    await newFollow.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

// 언팔
exports.unfollow = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const username = req.params.username;

    // 쿼리
    const user = await User.findOne({ username });
    const follow = await Follow
      .findOne({ follower: loginUser._id, following: user._id });
    
    // 팔로잉 중인 유저가 아닐 때
    if (!follow) {
      const err = new Error("Follow not found");
      err.status = 400;
      return next(err);
    }

    // 팔로우데이터 삭제
    await follow.delete();

    res.end();
    
  } catch (error) {
    next(error)
  }
}

// 팔로워 리스트
exports.follower_list = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    const follows = await Follow
      .find({ following: user._id }, "follower")
      .populate("follower")
    
      res.json(follows)

  } catch (error) {
    next(error)
  }
}
// 팔로잉 리스트
exports.following_list = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
    
    const follows = await Follow
      .find({ follower: user._id }, "following")
      .populate("following")
    
      res.json(follows)

  } catch (error) {
    next(error)
  }
}