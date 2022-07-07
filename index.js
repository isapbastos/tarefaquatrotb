const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"));

//-------------------------------banco de dados-------------------------------------------
const mongoose = require('mongoose');
const db_access = require('./setup/db').mongoURL; //onde será o acesso ao banco de dados
mongoose
.connect(db_access, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Conexão ao MongoDB foi bem sucedida!"))
.catch((err)=> console.log("Erro ao conectar no DB! ", err));
//----------------------------------------------------------------------------------------

//---------------------------------------Login--------------------------------------------
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const auth = require("./routes/auth");

app.use("/auth", auth);
//----------------------------------------------------------------------------------------

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


app.get('*', (req, res) => {
	res.send("Link Inválido: 404");
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});