document.addEventListener('DOMContentLoaded', () => {
    const loadCarsBtn = document.getElementById('loadCarsBtn');
    const carList = document.getElementById('carList');
    //cars = [];

    loadCarsBtn.addEventListener('click', () => {
        fetchCars();
    });

    function fetchCars() {
        fetch('http://localhost:3001/cars')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }
                return response.json();
            })
            .then(data => {
                displayCars(data);
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
            });
    }

    function displayCars(carsData) {
        carList.innerHTML = '';
        carsData.forEach((car, index) => {
            const carCard = createCarCard(car, index);
            carList.appendChild(carCard);
        });
    }

    function createCarCard(car, index) {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');
        carCard.innerHTML = `
            <h2>${car.make} ${car.model}</h2>
            <p><strong>Year:</strong> ${car.year}</p>
            <p><strong>Make:</strong> ${car.make}</p>
            <p><strong>Model:</strong> ${car.model}</p>
            <p><strong>Price:</strong> R${car.price}</p>
            <button class="btn btn-remove" data-index="${index}">Remove</button>
        `;
        return carCard;
    }
});
function addCar(newCar) {
    fetch('http://localhost:3001/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add car');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        document.getElementById('loadCarsBtn').click(); // Reload cars
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('carForm').addEventListener('submit', event => {
    event.preventDefault();
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    addCar({ make, model, year, price });
    // Optionally, reset the form after submission
    event.target.reset();
});

function removeCar(index, callback) {
    fetch(`http://localhost:3001/cars/${index}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete car');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        callback(); // Reload cars
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.getElementById('carList').addEventListener('click', event => {
    if (event.target.classList.contains('btn-remove')) {
        const index = event.target.dataset.index;
        removeCar(index, () => {
            document.getElementById('loadCarsBtn').click();
        });
    }
});
