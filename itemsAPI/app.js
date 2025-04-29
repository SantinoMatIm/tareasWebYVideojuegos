"use strict"

import express from "express";

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

import items from './public/js/items.js';

//Function to check if the item exists
const idExists = (id) => {
    return items.find(item => item.id === parseInt(id));
}

app.get('/items/:id', (req, res)=>{
    let item = idExists(req.params.id);
    if(item) {
        res.status(200).json({
            message: `The object with the id ${req.params.id} is: `,
            item
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