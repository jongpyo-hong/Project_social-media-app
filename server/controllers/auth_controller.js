
// 'user' 로직'
exports.user = async (req, res, next) => {
    // try and catch (에러처리)
    try {
        // 유저 데이터를 loginUser 변수에 담는다
        const loginUser = req.user;

        // # res.json()
        // 서버의 응답
        res.json(loginUser);
    } catch (error) {
        // # next()
        // 에러를 에러 핸들러에 전달한다
     next(error)
    }
}