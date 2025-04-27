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