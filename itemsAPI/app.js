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

