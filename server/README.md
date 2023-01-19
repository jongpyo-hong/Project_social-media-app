# SERVER

# MERN Stack
M (MongoDB) : 데이터베이스
E (Express) : 서버 프레임워크
R (React) : 프론트엔드 프레임 워크
N (NodeJS) : 서버 개발언어

# 파일과 데렉터리
- index.js
Entry point (애플리케이션의 시작점)
- package.json
애플리케이션의 정보들
- .env (enviroment variables)
환경변수(애플리케이션에서 전체적으로 사용되는 변수)를 저장하는 파일
- routes/
라우트 처리를 하는 파일들을 보관한다
라우트: 요청받은 url을 컨트롤러(로직처리)에 연결하는 역할을 한다
- controllers/
컨트롤러(로직 처리)
ex) 클라이언트로부터 받은 데이터 처리, 데이터베이스에 쿼리 전송 등
- model
데이터베이스 구조를 정의한다
- auth/
인증을 관리한다
- data/
유저가 업로드한 파일들을 보관한다
ex) 프로필 사진, 포스트 이미지 등