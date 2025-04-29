"use strict"

import express from "express";
import fs from 'fs';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

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

