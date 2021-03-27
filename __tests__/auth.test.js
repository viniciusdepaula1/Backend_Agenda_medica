const firebaseFunctions = require('../src/utils/firebaseFunctions');

const user = {
    name: "Vinicius",
    cpf: (Math.floor(Math.random() * (100000))).toString(),
    age: "21",
    phone: "31 9 2123-3213",
    email: "Viniciusdepaula@gmail.com",
    senha: "1234567",
}

describe('Firebase functions', () => {
    beforeEach(async () => {
        jest.setTimeout(50000);
    })

    it('Ca be created', async () => {
        const response = await firebaseFunctions.createUser(user.email, user.senha);
        expect(response).toBe(true);
    })

    it('Can be logged in', async() => {
        const response = await firebaseFunctions.checkUser();
        expect(response).toBe(true)
    })

    it('Can get token', async() => {
        const response = await firebaseFunctions.fGetIdToken();
        expect(response).not.toBe(false);
    })

    it('Can update email', async() => {
        const response = await firebaseFunctions.updateEmail("viniciusdepaula2@gmail.com");
        expect(response).toBe(true);

        const userT = await firebaseFunctions.returnUser();
        expect(userT.email).toBe("viniciusdepaula2@gmail.com");
    })

    it('Can update password', async() => {
        const response = await firebaseFunctions.updatePassword("12345677");
        expect(response).toBe(true);
    })

    it('Can signOut', async() => {
        const response = await firebaseFunctions.signOutUser();
        expect(response).toBe(true);
    })

    it('Not can be logged in', async() => {
        const response = await firebaseFunctions.checkUser();
        expect(response).toBe(false);
    })

    it('Can signIn', async() => {
        const response = await firebaseFunctions.signInUser("viniciusdepaula2@gmail.com", "12345677");
        expect(response).toBe(true);
    })

    it('Can delete account', async() => {
        const response = await firebaseFunctions.deleteUser("viniciusdepaula2@gmail.com", "12345677");
        expect(response).toBe(true);
    })

    it('Not can be logged in', async() => {
        const response = await firebaseFunctions.checkUser();
        expect(response).toBe(false);
    })
})