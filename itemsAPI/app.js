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

app.patch('items/:id', (req, res)=>{
    const itemId = parseInt(req.params.id);
    const updates = req.body; //Replaced fields
    // Search for the item index
    const itemIndex = items.findIndex(item => item.id === itemId);

    if(itemIndex === -1) {
        res.status(404).json({
            message: `The item with the id ${req.params.id} doesnt exist`
        })
    }

    // Update the required fields 
    const updatedItem = {...items[itemIndex]}

    //Iterate the required fields and properties and patch them
    for (const key in updates) {
        if (key !== 'id') {
            updatedItem[key] = updates[key];
        }
    }

    //Replace the original item with the patched one
    items[itemIndex] = updatedItem;

    res.status(200).json({
        message: `The item with the id ${req.params.id} has been updated`,
        item: updatedItem
    })
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

