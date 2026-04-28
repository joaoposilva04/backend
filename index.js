let carros = [
    {
        id: 1,
        nome: 'palio',
        marca:'fiat'
    },
    {
        id: 2,
        nome: 'gol',
        marca: 'volkswagem'
    },
    {
        id: 3,
        nome: 'corola',
        marca: 'hyundai'
    },
]
//importanto o express
const express = require('express')

//criando o sevidor
const app = express()

// criando a rota
app.get('/', (req, res) => {
   res.send('hello world');
})

app.get('/carros/:id', (req, res) => {
    const carId = req.params.id;
    const car = Carros.find(car => car.id === parseInt (carId));
    if (car) {
        console.log(car);
        res.send(car);
    } else{
        res.send(`Não existe carro com esse ID ${carId};`)
    }
});

app.delete('/carros/delete/id', (req,res) => {
    const carId = req.params.id;
    carros = carros.filter(car => car.id !== parseInt(carId));
    res.send(`carro ${carId} excluído com sucesso`)
    console.log(carros);
});

// iniciando o servidor
app.listen(3000)

console.log(`Não existe carro com esse ID ${carId};`)