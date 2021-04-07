const { app } = require('../src/index');
const { mongoose } = require('../src/index');
const request = require('supertest');
const UserModel = require('../src/models/User');
const firebaseFunctions = require('../src/utils/firebaseFunctions');
const DoctorModel = require('../src/models/Doctor');

const user = {
    name: "Vinicius",
    cpf: (Math.floor(Math.random() * (100000))).toString(),
    age: "21",
    phone: "31 9 2123-3213",
    email: "Viniciusdepaula1@gmail.com",
    senha: "1234567",
}

const doctor = {
    name: "Vinicius",
    cpf: (Math.floor(Math.random() * (100000))).toString(),
    crm: "012345",
    age: 21,
    phone: "31 9 2123-3213",
    specialities: ["especialidade1", "especialidade2", "especialidade3"],
    email: "ViniciusdepaulaDoctor1@gmail.com",
    senha: "1234567",
}


describe('BD User tests', () => {
    beforeAll(async () => {
        await firebaseFunctions.createUser(user.email, user.senha);
        jest.setTimeout(50000);
        user.token = await firebaseFunctions.fGetIdToken();
        user.firebaseUID = await firebaseFunctions.returnUID();
        jest.setTimeout(50000);
    });

    beforeEach(async () => {
        jest.setTimeout(50000);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('Can be created', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({
                cpf: user.cpf,
                name: user.name,
                age: user.age,
                phone: user.phone,
                firebaseUID: user.firebaseUID
            }).set("authorization", user.token)

        expect(response.body.user.name).toBe(user.name)
        expect(response.body.user.cpf).toBe(user.cpf)
        expect(response.body.user.age).toBe(user.age)
        expect(response.body.user.phone).toBe(user.phone)

        const find = await UserModel.findOne({ name: user.name, cpf: user.cpf }) !== null ? true : false
        user.id = response.body.user._id;
        expect(find).toBe(true);

        expect(response.status).toBe(201);
    })

    it('Can be logged', async () => {
        const response = await firebaseFunctions.checkUser();
        expect(response).toBe(true)
    })

    it('Can add one date', async () => {
        const insertDate = new Date(2021, 4, 2, 18, 30)
        const response = await request(app)
            .post('/doctor/addDate')
            .send({
                Data: insertDate, 
                UsuarioUID: user.firebaseUID, 
                Comments: "Comment1",
                schedule: insertDate,
                crm: doctor.crm,
                firebaseUID: user.firebaseUID
            }).set("authorization", user.token)

        const userTest = await UserModel.findOne({ firebaseUID: user.firebaseUID })

        expect(userTest.dates).toBe(1);
        expect(response.status).toBe(201)

    })

    it('Can delete date', async() => {
        const doctorTest = await DoctorModel.findOne({ crm:  doctor.crm })

        const insertDate = doctorTest.schedule[0]._id;

        const response = await request(app)
            .delete('/doctor/deleteDate')
            .send({
                date: insertDate,
                crm: doctor.crm,
                firebaseUID: user.firebaseUID
            }).set("authorization", user.token)

        expect(response.status).toBe(200)
    })

    it('Can search doctor by specialty', async() => {
        const specialty = "especialidade2"

        const response = await request(app)
            .get("/doctor/searchDoctors")
            .send({
                specialty: specialty
            }).set("authorization", user.token)

        expect(response.body.doctors.length).toBe(2)
        expect(response.status).toBe(200)
    })

    it('Can search doctor by crm', async() => {
        const crm = "012345"

        const response = await request(app)
        .get("/doctor/searchDoctors")
        .send({
            crm: crm
        }).set("authorization", user.token)

        expect(response.body.doctors.length).toBe(1)
        expect(response.status).toBe(200)
    })

    it('Can search clinic by cnpj', async() => {
        //seachClinic
        const response = await request(app)
        .get("/medicalClinic/seachClinic")
        .send({
            cnpj: "24737110000100"
        }).set("authorization", user.token)

        expect(response.status).toBe(200)
    })

    it('Can search clinic by name', async() => {
        //seachClinic
        const response = await request(app)
        .get("/medicalClinic/seachClinic")
        .send({
            name: "ClinicaTal"
        }).set("authorization", user.token)

        expect(response.status).toBe(200)
    })


    it('Can be deleted', async () => {
        const response = await request(app)
            .delete('/user/delete')
            .send({ firebaseUID: user.firebaseUID })
            .set("authorization", user.token);

        expect(response.body.message).toBe("User deleted");

        const find = await UserModel.findOne({ name: user.name, cpf: user.cpf }) !== null ? false : true
        expect(find).toBe(true);
        expect(response.status).toBe(200);

        if (response.status == 200) {
            const responseDelete = await firebaseFunctions.deleteUser(user.email, user.senha);
            expect(responseDelete).toBe(true);
        }
    })

    it('Not can be logged', async () => {
        const response = await firebaseFunctions.checkUser();
        expect(response).toBe(false)
    })
})
