"use strict"

import express from "express";
import fs from 'fs';
import items from './public/js/items.js';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

app.get('/', (req, res) => {
    fs.readFile('./public/html/items.html', 'utf8',
        (err, html) => {
            if(err){
                res.status(500).send('There was an error: '
                + err)
                return
            }
            console.log("Sending page...")
            res.send(html);
            console.log("Page sent!")
        })
});

// Function to verify if an item with the same id or name already exists
const itemExistsByIdOrName = (newItem) => {
    return items.some(item => item.id === newItem.id || item.name === newItem.name);
};

// Function to check if items array has elements
const hasItems = (array) => {
    return array.length > 0;
};

// Function to find an item by ID
const findItemById = (id) => {
    return items.find(item => item.id === parseInt(id));
};

// POST: Create one or more items
app.post('/items', (req, res) => {
    let newItems = req.body;
    // Convert to an array if only an object is sent
    if (!Array.isArray(newItems)) {
        newItems = [newItems];
    }

    let added = [];
    let errors = [];

    newItems.forEach(item => {
        if (!item.id || !item.name || !item.type || !item.effect) {
            errors.push({
                item,
                message: 'There are missing attributes for the item (id, name, type, effect)'
            });
        }
        else if (itemExistsByIdOrName(item)) {
            errors.push({
                item,
                message: 'The item is already on the server'
            });
        }
        else {
            items.push(item);
            added.push(item);
        }
    });

    // Response status
    if (errors.length > 0) {
        return res.status(409).json({
            message: 'These items could not be created',
            errors
        });
    }
    res.status(201).json({
        message: 'These items were successfully created',
        items: added
    });
});

// GET: Get all items
app.get('/items', (req, res) => {
    if(hasItems(items)) {
        res.status(200).json({
            message: 'These are the items on the catalog: ',
            items
        });
    }
    else {
        res.status(404).json({
            message: 'There are no items on the catalog'
        });
    }
});

// GET: Get item by ID
app.get('/items/:id', (req, res) => {
    let item = findItemById(req.params.id);
    if(item) {
        res.status(200).json({
            message: `The object with the id ${req.params.id} is: `,
            item
        });
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesn't exist`
        });
    }
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});