// let carros = [
//     {
//         id: 1,
//         nome: 'palio',
//         marca:'fiat'
//     },
//     {
//         id: 2,
//         nome: 'gol',
//         marca: 'volkswagem'
//     },
//     {
//         id: 3,
//         nome: 'corola',
//         marca: 'hyundai'
//     },
// ]
// //importanto o express
// const express = require('express')

// //criando o sevidor
// const app = express()

// // criando a rota
// app.get('/', (req, res) => {
//    res.send('hello world');
// })

// app.get('/carros/:id', (req, res) => {
//     const carId = req.params.id;
//     const car = Carros.find(car => car.id === parseInt (carId));
//     if (car) {
//         console.log(car);
//         res.send(car);
//     } else{
//         res.send(`Não existe carro com esse ID ${carId};`)
//     }
// });

// app.delete('/carros/delete/id', (req,res) => {
//     const carId = req.params.id;
//     carros = carros.filter(car => car.id !== parseInt(carId));
//     res.send(`carro ${carId} excluído com sucesso`)
//     console.log(carros);
// });

// // iniciando o servidor
// app.listen(3000)

//postman ele é usado como uma interfaçe grafica para simplificar desenvolvimento e teste

// console.log(`Não existe carro com esse ID ${carId};`)
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const dbconfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    // password:'root'
    database: 'sistema_pessoas'
}
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !! cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0, resto;
    for(let i = 1;i <= 9; i++) soma += parseInt(cpf.substring(i-1,i)) * (11-i);
    resto = (soma * 10) % 11;
    if((resto === 10) || (resto === 11)) resto = 0;
    if(resto === parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for(let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11
    if((resto === 10) || (resto === 11)) resto = 0;
    if(resto === parseInt(cpf.substring(10, 11))) return false;
    return true;
}
function validarIdade(dataNasc) {
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    const limite = new Date();
    limite.setFullYear(hoje.getFullYear() - 200);

    return nascimento > limite && nascimento <= hoje;
}
app.post('/pessoas', async (req, res) => {
    const { nome, cpf, data_nascimento } = req.body;

    //if(!validarCPF(cpf)) return res.status(400).json({ error: "CPF inválido"});
    if(!validarIdade(data_nascimento)) return res.status(400).json({ 
        error: "Data de nascimento inválida ou idade superio a 200 anos"
    }
);

    try {
        const connection = await mysql.createConnection(dbconfig);
        const [result] = await connection.execute(
            'INSERT INTO pessoas (nome, cpf, data_nascimento) VALUES (?, ?, ?)',
            [nome, cpf, data_nascimento]
        );
        await connection.end();
        res.status(201).json({ id: result.insertId, nome, cpf});
    } catch(err) {
        console.error("ERRO NO SEVIDOR", err); // isso vai detalhar o erro no seu terminal
        res.status(500).json({ error: err.message})
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))