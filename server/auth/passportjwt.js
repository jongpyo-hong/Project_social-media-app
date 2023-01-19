const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// User model
const { User } = require('../models/model');
const passport = require('passport');
const opts = {};
require('dotenv').config();

// HTTP 요청 헤더의 'Authorization' 속성으로부터 JWT를 추출한다
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 토큰을 암호화하기 위해 secret key가 필요하다
// 환경변수에서 secret key를 가져온다
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  // JWT으로부터 user를 db에서 검색한다
  User.findOne({ username: jwt_payload.username }, function (err, user) {
    if (err) {
      return done(err, false);
    } 

    if (user) { // 유저가 존재하는 경우, req.user 변수에 유저데이터를 할당한다
      return done(null, user);
    } 
    else { // 유저가 존재하지 않는 경우, 서버는 401(Unauthorized) 에러를 전송한다
      return done(null, false);
    }
  });
}));