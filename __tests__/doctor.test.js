const {server} = require('../src/index');
const {mongoose} = require('../src/index');
const request = require('supertest');
const DoctorModel = require('../src/models/Doctor');
const firebaseFunctions = require('../src/utils/firebaseFunctions');

const doctor = {
    name: "Vinicius",
    cpf: (Math.floor(Math.random() * (100000))).toString(),
    crm: "012345",
    age: 21,
    phone: "31 9 2123-3213",
    email: "ViniciusdepaulaDoctor1@gmail.com",
    senha: "1234567",
}

describe('BD Doctors test', () => {
    beforeAll(async () => {
        await firebaseFunctions.createUser(doctor.email, doctor.senha);
        jest.setTimeout(50000);
        doctor.token = await firebaseFunctions.fGetIdToken();
        doctor.firebaseUID = await firebaseFunctions.returnUID();
        jest.setTimeout(50000);
    });

    beforeEach(async () => {
        jest.setTimeout(50000);
    });

    afterAll(async () => {
        server.close();
        await mongoose.connection.close();
    });

    
    it('Can be created', async () => {
        const response = await request(server)
            .post('/doctor/create')
            .send({
                cpf : doctor.cpf,
                name : doctor.name,
                age : doctor.age,
                phone : doctor.phone,
                crm: doctor.crm,
                firebaseUID: doctor.firebaseUID
            }).set("authorization", doctor.token)
        
        expect(response.body.doctor.name).toBe(doctor.name)
        expect(response.body.doctor.cpf).toBe(doctor.cpf)
        expect(response.body.doctor.age).toBe(doctor.age)
        expect(response.body.doctor.phone).toBe(doctor.phone)
            
        const find = await DoctorModel.findOne({ name: doctor.name, cpf: doctor.cpf }) !== null ? true : false
        expect(find).toBe(true);
        expect(response.status).toBe(201);
    })

    it('Can add one date', async () => {
        const insertDate = Date.now()

        const response = await request(server)
            .post('/doctor/addDate')
            .send({
                schedule: insertDate,
                firebaseUID: doctor.firebaseUID
            }).set("authorization", doctor.token)
    
        expect(response.status).toBe(201)

    })

    it('Can add list of dates', async () => {
        const insertDate = [new Date(2021, 4, 2, 18, 30), new Date(2021, 5, 2, 16, 10), new Date(2021, 5, 3, 14, 50)];

        const response = await request(server)
            .post('/doctor/addDate')
            .send({
                schedule: insertDate,
                firebaseUID: doctor.firebaseUID
            }).set("authorization", doctor.token)

        expect(response.status).toBe(201)
    })
    
    it('Can be deleted', async () => {
        const response = await request(server)
            .delete('/doctor/delete')
            .send({
                firebaseUID: doctor.firebaseUID
            }).set("authorization", doctor.token)

        expect(response.body.message).toBe("Doctor deleted");

        const find = await DoctorModel.findOne({ name: doctor.name, cpf: doctor.cpf }) !== null ? false : true
        expect(find).toBe(true);
        expect(response.status).toBe(200);

        
        if(response.status == 200){
            const responseDelete = await firebaseFunctions.deleteUser(doctor.email, doctor.senha);
            expect(responseDelete).toBe(true);
        }

    })

})
