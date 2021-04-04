const admin = require('./firebaseInitilize');

const getAuthToken = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
}

const createMiddlewareClaims = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;

            if (authToken == null) {
                return res.status(401).send({ error: 'Null token' })
            }

            const userInfo = await admin.auth().verifyIdToken(authToken);
            req.authId = userInfo.uid;

            if (req.body.cnpj) {
                await admin.auth().setCustomUserClaims(req.authId, { type: 'clinic' })
                return next();
            }

            if (req.body.cpf) {
                console.log("setando claims user")
                await admin.auth().setCustomUserClaims(req.authId, { type: 'user' })
                return next();
            }
        } catch (error) {
            console.log(error);
            return res.status(401).send({ error: 'You are not authorized to make this request' });
        }
    })
}

const userClaimsMiddleware = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;

            if (authToken == null) {
                return res.status(401).send({ error: 'Null token' })
            }

            const userInfo = await admin.auth().verifyIdToken(authToken);
            req.authId = userInfo.uid;

            admin
                .auth()
                .getUser(req.authId).then((userRecord) => {                 
                    if(userRecord.customClaims.type == 'user')
                        return next();
                    else    
                        return res.status(401).send({ error: 'You are not authorized to make this request' });
                })

        } catch (error) {
            console.log(error);
            return res.status(401).send({ error: 'You are not authorized to make this request' });
        }
    })
}

const clinicClaimsMiddleware = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;

            if (authToken == null) {
                return res.status(401).send({ error: 'Null token' })
            }

            const userInfo = await admin.auth().verifyIdToken(authToken);
            req.authId = userInfo.uid;

            admin
                .auth()
                .getUser(req.authId).then((userRecord) => {                 
                    if(userRecord.customClaims.type == 'clinic')
                        return next();
                    else    
                        return res.status(401).send({ error: 'You are not authorized to make this request' });
                })

        } catch (error) {
            console.log(error);
            return res.status(401).send({ error: 'You are not authorized to make this request' });
        }
    })
}

module.exports = {
    createMiddlewareClaims,
    userClaimsMiddleware,
    clinicClaimsMiddleware
}