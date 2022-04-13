
const { animals } = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();




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



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});