
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));




// Function to filter anumals by query
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    let filteredResults = animalsArray;
    if (query.personalityTraits) {

        // Forces strings into an array so it can still be used
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // Loops through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {

            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults;
};



// Function to filter animals by ID
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];

    return result;
};



// Function to create new animals to send to the server
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
};



// Function requires all/correct information for input
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
};



// Route to get animals by query
app.get('/api/animals', (req, res) => {
    let results = animals;

    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});



// Route to get animals by ID only
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);

    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }

});



// Route to HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// Route to new animal HTML
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});



// Route to zookeeper HTML
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});



// Route to wildcard request/redirects to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// Route to add animals
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});




app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});