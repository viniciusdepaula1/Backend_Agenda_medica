const {app} = require('../src/index');
const {mongoose} = require('../src/index');
const request = require('supertest');
const MCModel = require('../src/models/MedicalClinic');
const firebaseFunctions = require('../src/utils/firebaseFunctions');
const DoctorModel = require('../src/models/Doctor');

const clinic = {
    name: "Clinica1",
    cnpj: "24737110000107",
    address: "Rua teste 123, Bairro tal, Estado MG",
    phone: "31 9 3132 3232",
    email: "Clinica123@gmail.com",
    senha: "1234567"
}

const doctor = {
    name: "Doctor1",
    cpf: (Math.floor(Math.random() * (100000))).toString(),
    crm: "0923499",
    age: 21,
    phone: "31 9 2123-3213",
    specialities: ["especialidade1", "especialidade2", "especialidade3"],
    email: "ViniciusdepaulaDoctor1@gmail.com",
    senha: "1234567",
}

const doctor1 = {
    crm: "0123499",
}

const doctorsList = [{
        crm: "012345",
    }, {
        crm: "012341",
    }
]

describe('BD Clinic test', () => {
    beforeAll(async () => {
        await firebaseFunctions.createUser(clinic.email, clinic.senha);
        jest.setTimeout(50000);
        clinic.token = await firebaseFunctions.fGetIdToken();
        clinic.firebaseUID = await firebaseFunctions.returnUID();
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
            .post('/medicalClinic/create')
            .send({
                cnpj : clinic.cnpj,
                name : clinic.name,
                phone : clinic.phone, 
                address: clinic.address,
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)        
            
        expect(response.body.clinic.name).toBe(clinic.name)
        expect(response.body.clinic.cnpj).toBe(clinic.cnpj)
        expect(response.body.clinic.phone).toBe(clinic.phone)
        expect(response.body.clinic.address).toBe(clinic.address)            
    })

    it('Can create one doctor', async () => {
        const response = await request(app)
            .post('/doctor/create')
            .send({
                cpf : doctor.cpf,
                name : doctor.name,
                age : doctor.age,
                phone : doctor.phone,
                crm: doctor.crm,
                specialities: doctor.specialities,
                firebaseUID: doctor.firebaseUID
            }).set("authorization", clinic.token)
        
        expect(response.body.doctor.name).toBe(doctor.name)
        expect(response.body.doctor.cpf).toBe(doctor.cpf)
        expect(response.body.doctor.age).toBe(doctor.age)
        expect(response.body.doctor.phone).toBe(doctor.phone)
        expect(response.body.doctor.specialities.length).toBe(3);
            
        const find = await DoctorModel.findOne({ name: doctor.name, cpf: doctor.cpf }) !== null ? true : false
        expect(find).toBe(true);
        expect(response.status).toBe(201);
    })

    it('Can delete one doctor', async () => {
        const response = await request(app)
            .delete('/doctor/delete')
            .send({
                cpf: doctor.cpf,
                name: doctor.name
            }).set("authorization", clinic.token)

        expect(response.body.message).toBe("Doctor deleted");

        const find = await DoctorModel.findOne({ name: doctor.name, cpf: doctor.cpf }) !== null ? false : true
        expect(find).toBe(true);
        expect(response.status).toBe(200);
    })

    it('Can add one doctor in my list', async () => {
        const response = await request(app)
            .post('/medicalClinic/addDoctor')
            .send({
                crm: doctor1.crm,
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)
    
        const list = response.body.MedicalClinic.DoctorsList; 

        expect(list.length).toBe(1)

        expect(response.status).toBe(201)
    })

    it('Can add list of doctors in my list', async () => {
        const response = await request(app)
            .post('/medicalClinic/addDoctor')
            .send({
                crm: doctorsList,
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)

        const list = response.body.MedicalClinic.DoctorsList; 

        expect(list.length).toBe(3)

        expect(response.status).toBe(201)
    })

    it('Can delete one doctor of my list', async () => {
        const response = await request(app)
            .post('/medicalClinic/deleteDoctor')
            .send({
                crm: "012341",
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)

            const list = response.body.MedicalClinic2.DoctorsList; 

            expect(list.length).toBe(2)
    
            expect(response.status).toBe(201)
    })

    it('Can get all doctors', async () => {
        const response = await request(app)
            .get('/medicalClinic/returnDoctors')
            .send({
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)    
        
        expect(response.status).toBe(200)
        expect(response.body.doctorsList.length).toBe(2)
    })

    it('Can be deleted', async () => {
        const response = await request(app)
            .delete('/medicalClinic/delete')
            .send({
                firebaseUID: clinic.firebaseUID
            }).set("authorization", clinic.token)

        expect(response.body.message).toBe("Medical clinic deleted");

        const find = await MCModel.findOne({ cnpj: clinic.cnpj }) !== null ? false : true
        expect(find).toBe(true);
        expect(response.status).toBe(200);
        
        if(response.status == 200){
            const responseDelete = await firebaseFunctions.deleteUser(clinic.email, clinic.senha);
            expect(responseDelete).toBe(true);
        }

    })

})
