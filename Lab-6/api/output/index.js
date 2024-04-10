/*module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
    /*    body: responseMessage
    };
}    */  

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());


app.use(express.json());

const cars = require('./cars.json');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//get all cars
app.get('/cars', (req, res) => {
    res.json(cars);
});

//get car by id
app.get('/cars/:id', (req, res) => {
    const id = req.params.id;
    const car = cars.find(car => car.id === id);
    res.json(car);
});

//update car
app.put('/cars/:id', (req, res) => {
    const id = req.params.id;
    const updatedCar = req.body;
    const index = cars.findIndex(car => car.id === id);
    cars[index] = updatedCar;
    res.json(updatedCar);
});

//delete car
app.delete('/cars/:index', (req, res) => {
    const id = parseInt(req.params.index);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid car index. Index must be a number.' });
    }
    if (id < 0 || id >= cars.length) {
        return res.status(400).json({ error: 'Invalid car index.' });
    }
    const delCar = cars.splice(id, 1)[0];
    res.json(delCar);
});

//add car
app.post('/cars', (req, res) => {
    const { make, model, year, price } = req.body;
    if (!make || !model || !year || !price) {
        return res.status(400).json({ error: 'Missing required fields. Please provide make, model, year, and price.' });
    }
    const newCar = { make, model, year, price };
    console.log(req);
    console.log(newCar);
    cars.push(newCar);
    res.json(newCar);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:3001`);
});