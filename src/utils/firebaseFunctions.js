//só uso isso nos testes
require('dotenv').config();
import app from 'firebase/app'
import 'firebase/auth'

//process.env.DB

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

//simulando o frontend
const auth = app.initializeApp(firebaseConfig).auth()

module.exports = {
    async createUser(email, password) {
        const result = await auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                return true
            })
            .catch((error) => {
                console.log(error);
                return false
            })

        return result;
    },

    async signInUser(email, pass) {
        const result = await auth.signInWithEmailAndPassword(email, pass)
            .then((user) => {
                return true;
            })
            .catch((error) => {
                return false;
            })

        return result;
    },

    async returnUser() {
        return auth.currentUser;
    },

    async checkUser() {
        if (auth.currentUser)
            return true

        return false
    },

    async updateEmail(email) {
        var user = auth.currentUser;

        const response = user.updateEmail(email).
            then(() => {
                return true
            }).catch(function (error) {
                console.log(error);
                return false
            });

        return response;
    },

    async updatePassword(pass) {
        var user = auth.currentUser;

        const response = await user.updatePassword(pass).then(() => {
            return true;
        }).catch((error) => {
            return false;
        });

        return response;
    },

    async signOutUser() {
        const response = await auth.signOut().then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error)
            return false;
        })

        return response;
    },

    async deleteUser(email, password) {
        const response = await auth.signInWithEmailAndPassword(email, password)
            .then(async function (credential) {
                const deleteResult = await credential.user.delete().then(() => {
                    return true;
                }).catch((error) => {
                    return false;
                })

                return deleteResult;
            })
        
        return response;
    },

    async fGetIdToken() {
        const user = auth.currentUser

        if (user) {
            const token1 = await auth.currentUser.getIdToken(true)
                .then(async (idToken) => {
                    return idToken;
                })
                .catch(error => {
                    console.log(error);
                    return false;
                })

            return `Bearer ${token1}`;
        }
        return false;
    }


}
