"use strict"

import express from "express";
import fs from 'fs';
import items from './public/js/items.js'

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

let users = [];

//Function to verify if the user already exists
const userExists = (newUser) => {
    return users.some(user => user.id === newUser.id || user.name === newUser.name)
}

//Function to verify that the item on the list exists
const idExists = (id) => {
    return items.some(item => item.id === parseInt(id));
}

//Endpoint to create one or more users
app.post('/users', (req, res)=>{
        let newUsers = req.body;
        //Convert to an array if only an object is sent
        if (!Array.isArray(newUsers)) {
            newUsers = [newUsers];
        }

        let added = [];
        let errors = [];

        newUsers.forEach(user => {
            if (!user.id || !user.name || !user.mail || !user.email || !user.items) {
                errors.push({
                    user,
                    message: 'There are missing attributes for the user (id, name, mail, email, items)'
                })
                return;
            }
            if (userExists(user)) {
                errors.push({
                    user,
                    message: 'The user is already registered'
                })
                return;
            }
            
            const invalidItems = [];

            if (!Array.isArray(user.items)) {
                user.items = [user.items];
            }

            for (const itemID of user.items) {
                if (!idExists(itemID)) {
                    invalidItems.push(itemID);
                }
            }

            if (invalidItems.length > 0) {
                errors.push({
                    user,
                    message: `The following items do not exist: ${invalidItems.join(', ')}`
                })
                return;
            }
                users.push(user);
                added.push(user);
        
        });


    //Response status

    if (errors.length > 0) {
        return res.status(409).json({
            message: 'This user could not be registeres',
            errors
        })
    }
    res.status(201).json({
        messsage: 'This user was succesfully registered',
        users: added
    })
})

app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})

