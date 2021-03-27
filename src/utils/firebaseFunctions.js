//só uso isso nos testes
import app from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAsYL41mkjOIOexCWK1ACL7vgrySS7zpxE",
    authDomain: "agenda-medica-3418b.firebaseapp.com",
    projectId: "agenda-medica-3418b",
    storageBucket: "agenda-medica-3418b.appspot.com",
    messagingSenderId: "162050477758",
    appId: "1:162050477758:web:932e2c4c737d0dbcfcd8ef",
    measurementId: "G-4V5SLEBL4L"
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
