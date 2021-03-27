// import models
const UserModel = require('../models/User');


/**
 * Definições públicas
 */
module.exports = {
    async create(req, res) {
        const { name, cpf, age, phone } = req.body
    
        if(name == null || cpf == null || age == null || phone == null)
            return res.status(206).send({ error: 'Insufficient data' });

        try {
            if(await UserModel.findOne({ cpf: cpf }))
                return res.status(400).send({ error: 'User already exists.' });

            const user = await UserModel.create({
                cpf: cpf,
                name: name,
                age: age,
                phone: phone
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
        const {id} = req.body;

        try {
            const response = await UserModel.deleteOne({ _id : id });

            if(response)
                return res.status(200).send({ message: 'User deleted' });

            return res.status(400).send({ error: 'Problem when deleting user' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server request failed' });
        }
    }
};