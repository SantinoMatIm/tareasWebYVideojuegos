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

//Function to verify if there are no users 

function userExists(array) {
    return array.length > 0;
}

app.get('/users', (req, res)=>{
    if(userExists(users)) {    
        // Create copy of the users array
        const fullUsers = JSON.parse(JSON.stringify(users)); 
        
        fullUsers.forEach(user => {
            user.items = user.items.map(itemID =>{
                const fullItem = items.find(item => item.id === itemID);
                return fullItem;
            })
        });
        res.status(200).json ({
            message: 'These are the users registered: ',
            fullUsers
        })
    }
    else {
        res.status(404).json({
            message: 'There are no users registeres'
        })
    }
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

