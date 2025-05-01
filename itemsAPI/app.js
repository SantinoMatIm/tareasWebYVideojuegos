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
import users from './public/js/users.js';

//Function to check if the item exists
const idExists = (id) => {
    return users.find(user => user.id === parseInt(id));
}

app.get('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        return res.status(404).json({
            message: `User with id ${userId} not found`
        });
    }
    
    const fullUser = JSON.parse(JSON.stringify(user));
    
    // Reemplazar los IDs de items con sus objetos completos
    fullUser.items = fullUser.items.map(itemId => {
        const fullItem = items.find(item => item.id === itemId);
        // Manejar el caso de que el item no exista
        return fullItem
    });
    
    res.status(200).json({
        message: `User with id ${userId} found`,
        user: fullUser
    });
});

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

