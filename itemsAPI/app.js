"use strict"

import express from "express";
import items from './public/js/items.js';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

//Function to check if the item exists (same as the one in get-item-by-id)
const idExists = (id) => {
    return items.find(item => item.id === parseInt(id));
}

app.get('/items/:id', (req, res)=>{
    const itemId = parseInt(req.params.id);
    const item = idExists(req.params.id);
    if (item) {
        res.status(200).json({
            item
        })
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesnt exist`
        })
    }
})

app.delete('/items/:id', (req, res)=>{
    const itemId = parseInt(req.params.id);
    const item = idExists(req.params.id);
    if (item) {
        items = items.filter(item => item.id !== itemId)
        res.status(200).json({
            message: `The object with the id ${req.params.id} was deleted, this is the new catalog`,
            items
        })
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesnt exist`
        })
    }
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})