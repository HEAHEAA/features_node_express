
exports.JwtGetData = async(req, res) => {
    res.json({
        message: 'success',
        status: true,
        data:[{id:1, name: '홍길동'}],
        error: null
    });
};