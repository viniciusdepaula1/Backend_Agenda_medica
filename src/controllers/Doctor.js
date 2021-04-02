const DoctorModel = require('../models/Doctor')

module.exports = {
    async create(req, res) {
        const { firebaseUID, name, cpf, crm, age, phone } = req.body

        if (name == null || cpf == null || age == null || phone == null || crm == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            if (await DoctorModel.findOne({ cpf: cpf }))
                return res.status(400).send({ error: 'Doctor already exists.' });

            const doctor = await DoctorModel.create({
                cpf: cpf,
                name: name,
                age: age,
                phone: phone,
                crm: crm,
                firebaseUID: firebaseUID
            });

            return res.status(201).send({ doctor })

        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async addDate(req, res) {
        const { schedule, firebaseUID } = req.body

        if(schedule == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });
        if(Object.prototype.toString.call(schedule) === '[object Date]')
            return res.status(400).send({ error: 'Invalid type date' });

        try {
            const doctor = await DoctorModel.findOne({ firebaseUID: firebaseUID})
            
            if(Array.isArray(schedule)){
                schedule.map(async (date) => {
                    await doctor.schedule.push(date);
                })     
                await doctor.save();
            } else {
                await doctor.schedule.push(schedule);
                await doctor.save()    
            }

            return res.status(201).send({doctor})

        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async delete(req, res) {
        const {firebaseUID} = req.body;

        try {
            const response = await DoctorModel.deleteOne({ firebaseUID : firebaseUID });

            if(response)
                return res.status(200).send({ message: 'Doctor deleted' });

            return res.status(400).send({ error: 'Problem when deleting doctor' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    }

}