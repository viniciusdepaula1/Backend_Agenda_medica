const {server} = require('../src/index');
const {mongoose} = require('../src/index');
const request = require('supertest');
const UserModel = require('../src/models/User');

describe('User tests', () => {
    const user = {
        name: "Vinicius",
        cpf: (Math.floor(Math.random() * (100000))).toString(),
        age: "21",
        phone: "31 9 2123-3213"
    }

    beforeAll(async () => {

    });

    beforeEach( async () => {
        jest.setTimeout(50000);
    });

    afterAll(async () => {
        server.close();
        await mongoose.connection.close();
    });


    it('Can be created', async () => {
        const response = await request(server)
            .post('/user/create')
            .send({
                cpf : user.cpf,
                name : user.name,
                age : user.age,
                phone : user.phone 
            })
                 
        expect(response.body.user.name).toBe(user.name)
        expect(response.body.user.cpf).toBe(user.cpf)
        expect(response.body.user.age).toBe(user.age)
        expect(response.body.user.phone).toBe(user.phone)

        const find = await UserModel.findOne({ name: user.name, cpf: user.cpf }) !== null ? true : false
        user.id = response.body.user._id;
        expect(find).toBe(true);

        expect(response.status).toBe(201);
    })

    it('Can be deleted', async () => {
        const response = await request(server)
            .delete('/user/delete')
            .send({id : user.id});
            
        expect(response.body.message).toBe("User deleted");
    })
})
