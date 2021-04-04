const DoctorModel = require('../models/Doctor')
const UserModel = require('../models/User');
const DateModel = require('../models/Date')

module.exports = {
    async create(req, res) {
        const { name, cpf, crm, age, phone, specialities } = req.body

        if (name == null || cpf == null || age == null || phone == null || crm == null || specialities == null)
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
                specialities: specialities,
            });

            return res.status(201).send({ doctor })

        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async addDate(req, res) {
        const {  Data, UsuarioUID, Comments, crm, firebaseUID } = req.body
        
        if (crm == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });
    
        try {
            const user = await UserModel.findOne({ firebaseUID: firebaseUID })

            if (!user) {
                return res.status(400).send({ error: 'User not found' });
            }

            let check = 0;

            if(user.dates)
                check = user.dates + 1;
            else 
                check += 1

            if (check > 3) {
                return res.status(400).send({ error: 'Maximum scheduled appointments' });
            }
            
            const doctor = await DoctorModel.findOne({ crm: crm })

            const schedule = {
                Comments: Comments,
                Date: Data,
                UsuarioUID: UsuarioUID
            }
            
            await doctor.schedule.push(schedule);
            await doctor.save()
            await user.updateOne({ dates: check })
            
            const doctor2 = await DoctorModel.findOne({ crm: crm })

            return res.status(201).send({ doctor2 })

        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async deleteDate(req, res) {
        const { scheduleId, crm, firebaseUID } = req.body;

        try {
            const user = await UserModel.findOne({ firebaseUID: firebaseUID })
            const doctor = await DoctorModel.findOne({ crm: crm })

            var i = doctor.schedule.find(function(item, index) {
                if(item._id == scheduleId)
                    return true;
            })

            doctor.schedule.pop(i);

            if(user.dates)
                await user.updateOne({dates: user.dates-1})

            await doctor.save();
    
            return res.status(200).send({ message: 'Date deleted' });
        } catch(err) {
            console.log(err)
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async delete(req, res) {
        const { cpf, name } = req.body;

        try {
            const response = await DoctorModel.findOne({ name: name, cpf: cpf })

            if (response) {
                console.log(response);
                await response.delete();
                return res.status(200).send({ message: 'Doctor deleted' });
            }

            return res.status(400).send({ error: 'Problem when deleting doctor' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    }

}