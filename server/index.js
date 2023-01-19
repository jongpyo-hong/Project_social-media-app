// # PACKAGES
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
// 라우터
const indexRouter = require("./routes/index");
require('dotenv').config();

// # DATABASE connection
// 데이터베이스 쿼리를 JavaScript 언어로 작성할 수 있다
const mongoose = require("mongoose"); // mongoDB용 ODM(Object Document Model);
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// # MIDDLEWARE (애플리케이션의 작동에 필요한 코드 묶음)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/static', express.static('public'));
app.use('/data', express.static('data'));
app.use('/', indexRouter);

// # ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  // 서버가 에러 객체를 응답코드와 함께 클라이언트에게 전송한다
  // 컨트롤러로부터 전달받은 status가 있으면 그 status를 사용한다
  // 전달받은 status가 없으면 500(Internal Server Error)로 처리한다
  res.status(err.status || 500).json(err); 
})

// # SERVER RUNNING MESSAGE
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})