const MCModel = require('../models/MedicalClinic')
const DoctorModel = require('../models/Doctor')

module.exports = {
    async create(req, res) {
        const { firebaseUID, name, cnpj, address, phone } = req.body

        if (name == null || cnpj == null || address == null || phone == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            if (await MCModel.findOne({ cnpj: cnpj }))
                return res.status(400).send({ error: 'Medical Clinic already exists.' });

            const clinic = await MCModel.create({
                cnpj: cnpj,
                name: name,
                address: address,
                phone: phone,
                firebaseUID: firebaseUID
            });

            return res.status(201).send({ clinic })

        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async search(req, res) {
        const { name, cnpj } = req.body

        if (name == null && cnpj == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            var clinic = false;

            if(name)
                clinic = await MCModel.findOne({ name: name })

            if(cnpj)
                clinic = await MCModel.findOne({ cnpj: cnpj })

            if(clinic){
                res.status(200).send({ clinic })
            } else {
                return res.status(400).send({ error: 'Clinic not found' });
            }

        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async addDoctor(req, res) {
        const { crm, firebaseUID } = req.body

        if (crm == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            const MedicalClinic = await MCModel.findOne({ firebaseUID: firebaseUID })

            if (Array.isArray(crm)) {
                crm.map(async (doctorCrm) => {
                    await MedicalClinic.DoctorsList.push(doctorCrm.crm);
                })
                await MedicalClinic.save();

            } else {
                await MedicalClinic.DoctorsList.push(crm);
                await MedicalClinic.save()
            }

            return res.status(201).send({ MedicalClinic })

        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async deleteDoctorOfList(req, res) {
        const { crm, firebaseUID } = req.body

        if (crm == null || firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });
        try {
            const MedicalClinic = await MCModel.findOne({ firebaseUID: firebaseUID })
            await MedicalClinic.updateOne({
                $pull: {
                    DoctorsList: crm
                }
            })
            const MedicalClinic2 = await MCModel.findOne({ firebaseUID: firebaseUID })

            return res.status(201).send({ MedicalClinic2 })

        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }

    },

    async returnAll(req, res) {
        const { firebaseUID } = req.body;

        if (firebaseUID == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            const clinic = await MCModel.findOne({ firebaseUID: firebaseUID })
            var doctorsList = []

            for (var i = 0; i < clinic.DoctorsList.length; i++) {
                var doctor = await DoctorModel.findOne({ crm: clinic.DoctorsList[i] })
                doctorsList.push(doctor);
            }

            res.status(200).send({ doctorsList })

        } catch (error) {
            console.log(error)
            return res.status(500).send({ error: 'Server request failed' });
        }
    },

    async delete(req, res) {
        const { firebaseUID } = req.body;

        try {
            const response = await MCModel.deleteOne({ firebaseUID: firebaseUID });

            if (response)
                return res.status(200).send({ message: 'Medical clinic deleted' });

            return res.status(400).send({ error: 'Problem when deleting medical clinic' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    }

}