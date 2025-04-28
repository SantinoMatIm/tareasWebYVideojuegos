"use strict"

import express from "express";

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

import items from './public/js/items.js';

//Function to check if the item exists (same as the one in get-item-by-id)
const idExists = (id) => {
    return items.find(item => item.id === parseInt(id));
}

app.delete('/items/:id', (req, res)=>{
    const item = idExists(req.params.id);

    if (item) {
        let newItems = items.filter()
        res.status(200).json({
            message: `The object with the id ${req.params.id} was deleted`,
            
        })
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesnt exist`
        })
    }
})