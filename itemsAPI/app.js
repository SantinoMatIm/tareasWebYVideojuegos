"use strict"

import express from "express";
import users from './public/js/users.js';
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

//Function to check if the user exists
const idExists = (id) => {
    return users.find(user => user.id === parseInt(id));
}

app.delete('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id);
    const user = idExists(req.params.id);
    if (user) {
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
        users.splice(userIndex, 1);
        }
        res.status(200).json({
            message: `The user with the id ${req.params.id} was deleted, this is the new catalog`,
            users
        })
    }
    else {
        res.status(404).json({
            message: `The user with the id ${req.params.id} doesnt exist`
        })
    }
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

