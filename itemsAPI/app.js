"use strict"

import express from "express";
import fs from 'fs';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

app.get('/', (req, res) =>{
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
})

import items from './public/js/items.js';

//Function to verify if the item already exists
const itemExists = (newItem) => {
    return items.some(item => item.id === newItem.id || item.name === newItem.name)
}

//Endpoint to create one or more items
app.post('/items', (req, res)=>{
        let newItems = req.body;
        //Convert to an array if only an object is sent
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
                })
            }
            else if (itemExists(item)) {
                errors.push({
                    item,
                    message: 'The item is already on the server'
                })
            }
            else {
                items.push(item);
                added.push(item);
            }
        });
})

    //Response status

    if (errors.length > 0) {
        return res.status(409).json({
            message: 'These items could not be created',
            errors
        })
    }
    res.status(201).json({
        messsage: 'These items were succesfully created',
        items: added
    })

//Function to verify if there are no items

function itemExists(array) {
    return array.length > 0;
}

app.get('/items', (req, res)=>{
    if(itemExists(items)) {
        res.status(200).json ({
            message: 'These are the items on the catalog: ',
            items
        })
    }
    else {
        res.status(404).json({
            message: 'There are no items on the catalog'
        })
    }
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

