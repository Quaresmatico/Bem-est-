const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/timepieceshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000
});

const ProdutoRelogioSchema = new mongoose.Schema({
    id_produtorelogio: { type: String, required: true },
    descricao: { type: String, required: true },
    marca: { type: String, required: true },
    data_fabricacao: { type: Date, required: true },
    anos_garantia: { type: Number, required: true }
});

const ProdutoRelogio = mongoose.model("ProdutoRelogio", ProdutoRelogioSchema);

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String }
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.post("/cadastroProdutoRelogio", async (req, res) => {
    const { id_produtorelogio, descricao, marca, data_fabricacao, anos_garantia } = req.body;

    function verificarAnosGarantia(anosGarantia) {
        if (anosGarantia > 4) {
            return "Limite de garantia excedido. Máximo 4 anos de garantia permitidos.";
        } else if (anosGarantia <= 0) {
            return "Valor de anos de garantia inválido. Informe um valor positivo menor ou igual a 4.";
        } else {
            return "Cadastro permitido.";
        }
    }
    
const anosGarantia1 = 3; // Menor que 4, permitido
const anosGarantia2 = 6; // Maior que 4, não permitido
const anosGarantia3 = -2; // Menor ou igual a 0, não permitido

console.log(verificarAnosGarantia(anosGarantia1)); // Saída: Cadastro permitido.
console.log(verificarAnosGarantia(anosGarantia2)); // Saída: Limite de garantia excedido. Máximo 4 anos de garantia permitidos.
console.log(verificarAnosGarantia(anosGarantia3)); // Saída: Valor de anos de garantia inválido. Informe um valor positivo menor ou igual a 4.

    const produtoRelogio = new ProdutoRelogio({
        id_produtorelogio,
        descricao,
        marca,
        data_fabricacao,
        anos_garantia
    });

    try {
        const newProdutoRelogio = await produtoRelogio.save();
        res.json({ error: null, msg: "Cadastro feito com sucesso", produtoRelogioId: newProdutoRelogio._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.post("/cadastrousuario", async (req, res) => {
    const { email, senha } = req.body;

    if (email == null || senha == null) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const usuario = new Usuario({
        email,
        senha
    });

    try {
        const newUsuario = await usuario.save();
        res.json({ error: null, msg: "Cadastro feito com sucesso", usuarioId: newUsuario._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get("/cadastroProdutoRelogio", async (req, res) => {
    res.sendFile(__dirname + "/cadastroProdutoRelogio.html");
});

app.get("/cadastrousuario", async (req, res) => {
    res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});