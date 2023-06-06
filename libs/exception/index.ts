export default class Exception {
    static handle(req, res, e) {
        res.status(500).json({
            statusCode: 500,
            message: e,
        });
    }
}