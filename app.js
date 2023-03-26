const express = require("express");
const app = express();
const router = express.Router();
const { sequelize } = require("./models");

const usersRouter = require('./routes/users.js')
const postsRouter = require("./routes/posts.js");
const commentsRouter = require('./routes/comments.js')

sequelize //서버 실행 시 MySQL과 연결
  .sync({ force: false }) // 서버 실행 시 테이블 재생성할 건지?
  .then(() => {
      console.log("데이터베이스 연결 성공!"); 
  })
  .catch((err) => {
      console.error(err);
  });

app.use(express.json())

app.use('/api', [usersRouter, postsRouter, commentsRouter]) 


console.log('연습중입니다.');

app.use("/api", express.urlencoded({ extended: false }), router);

app.listen(5000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});