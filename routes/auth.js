const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

//-------------------------------tratar essa autenticação---------------------------------
const Pessoa = require("../models/pessoa");//importar a coleção

router.post('/signup', (req, res) => {
	Pessoa.findOne({email: req.body.email})
	.then(doc_pessoa => {
		if (doc_pessoa) {
			//já existe um documento com aquele email
			return res.status(400).json({emailerror: "Email já registrado no sistema"});
		} else {
			//registrar (inserir a informação no banco de dados)
			const novo_registro_pessoa = Pessoa({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				message: req.body.message
			});

			//criptografar a senha
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(novo_registro_pessoa.password, salt, function(err, hash) {
					if (err) throw err;
					novo_registro_pessoa.password = hash;

					//salva no db
					novo_registro_pessoa
					.save()
					.then((doc_pessoa) => res.status(200).json(doc_pessoa))
					.catch((err) => console.log("Deu erro no registro: ", err));
				});
		});
		}
	})
	.catch((err) => console.log("Erro ao registrar: ", err));
});
//----------------------------------------------------------------------------------------

router.get("/", (req, res) => res.json({status: "Acesso permitido"}));

module.exports = router;