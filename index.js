const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"));

app.use(bodyparser.urlencoded({extended: false}));

let port = 3000;

let get_request_time = function(req, res, next) {
	let tempo_atual = Date.now();
	let hoje = new Date(tempo_atual);
	req.request_time = hoje.toUTCString();//converter para string de dd,mm,aaaa,hh:mm:ss
	next();
}

app.use(get_request_time);

app.get('/', (req, res) => {
	res.send("Olá! Você acessou a página raiz em " + req.request_time);
});


app.get('/contact', (req, res) => {
	res.render("contact")
})

app.post('/contact', (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let message = req.body.message;
	let data_json = {
		"Nome": name,
		"E-mail": email,
		"Message": message
	}

	res.status(200).json(data_json);
})

app.get('*', (req, res) => {
	res.send("Link Inválido: 404");
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});