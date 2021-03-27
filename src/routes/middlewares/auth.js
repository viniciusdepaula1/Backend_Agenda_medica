const admin = require('./firebaseInitilize');

const getAuthToken = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
}

const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;

            if(authToken == null){
                return res.status(401).send({ error: 'Null token' })
            }

            const userInfo = await admin.auth().verifyIdToken(authToken);
            req.authId = userInfo.uid;
            return next();
        } catch (error) {
            console.log(error);
            return res.status(401).send({ error: 'You are not authorized to make this request' });
        }
    })
}

module.exports = { checkIfAuthenticated }