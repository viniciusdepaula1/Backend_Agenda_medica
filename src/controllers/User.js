// import models
const UserModel = require('../models/User');
const DoctorModel = require('../models/Doctor');

/**
 * Definições públicas
 */
module.exports = {
    async create(req, res) {
        const { name, cpf, age, phone, firebaseUID } = req.body
    
        if(name == null || cpf == null || age == null || phone == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            if(await UserModel.findOne({ cpf: cpf }))
                return res.status(400).send({ error: 'User already exists.' });

            const user = await UserModel.create({
                cpf: cpf,
                name: name,
                age: age,
                phone: phone,
                firebaseUID: firebaseUID
            });

            return res.status(201).send( { user })
    
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async list(req, res) {
        try {
            let users = await UserModel.find({});
            return res.status(200).send({users});
        } catch(err) {
            console.log(err)
            return res.status(500).send({ error: 'Server request failed'});
        }
    },

    async delete(req, res) {
        const {firebaseUID} = req.body;

            
        if(firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            const response = await UserModel.deleteOne({ firebaseUID : firebaseUID });

            if(response)
                return res.status(200).send({ message: 'User deleted' });

            return res.status(400).send({ error: 'Problem when deleting user' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async markCalendar(req, res) {
        const { date, crm, firebaseUID } = req.body;

            
        if(date == null || crm == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        if(Object.prototype.toString.call(schedule) === '[object Date]')
            return res.status(400).send({ error: 'Invalid type date' });

        try {
            const doctor = DoctorModel.findOne({crm : crm});
            
            doctor.schedule.map((data) => {
                if(data.year == date.year && data.month == date.month && data.day == date.day && 
                    data.hour == date.hour && data.minute == date.minute) {
                        return res.status(400).send({ 
                            error: 'Doctor already has an appointment at that time'
                        });
                }
            })

            if(doctor){
                doctor.schedule.push(date)
                doctor.save()
            }

            return res.status(200).send({ message: 'Saved medical consultation' });

        } catch (err) {
            return res.status(500).send({ error: 'Server request failed' });
        }
    }
};