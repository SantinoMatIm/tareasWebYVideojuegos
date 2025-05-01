"use strict"

import express from "express";
import fs from 'fs';
import items from './public/js/items.js';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

let users = []; // Array para almacenar usuarios

// ===== FUNCIONES AUXILIARES =====

// Función para verificar si un item existe por ID o nombre
const itemExistsByIdOrName = (newItem) => {
    return items.some(item => item.id === newItem.id || item.name === newItem.name);
};

// Función para verificar si un item existe por ID
const findItemById = (id) => {
    return items.find(item => item.id === parseInt(id));
};

// Función para verificar si un ID de item existe en el array de items
const itemIdExists = (id) => {
    return items.some(item => item.id === parseInt(id));
};

// Función para verificar si un array tiene elementos
const hasItems = (array) => {
    return array.length > 0;
};

// Función para verificar si un usuario existe por ID o nombre
const userExists = (newUser) => {
    return users.some(user => user.id === newUser.id || user.name === newUser.name);
};

// ===== RUTAS =====

// Ruta principal
app.get('/', (req, res) => {
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
});

// ===== ENDPOINTS DE ITEMS =====

// POST: Crear uno o más items
app.post('/items', (req, res) => {
    let newItems = req.body;
    // Convertir a array si solo se envía un objeto
    if (!Array.isArray(newItems)) {
        newItems = [newItems];
    }

    let added = [];
    let errors = [];

    newItems.forEach(item => {
        if (!item.id || !item.name || !item.type || !item.effect) {
            errors.push({
                item,
                message: 'There are missing attributes for the item (id, name, type, effect)'
            });
        }
        else if (itemExistsByIdOrName(item)) {
            errors.push({
                item,
                message: 'The item is already on the server'
            });
        }
        else {
            items.push(item);
            added.push(item);
        }
    });

    // Respuesta
    if (errors.length > 0) {
        return res.status(409).json({
            message: 'These items could not be created',
            errors
        });
    }
    res.status(201).json({
        message: 'These items were successfully created',
        items: added
    });
});

// GET: Obtener todos los items
app.get('/items', (req, res) => {
    if(hasItems(items)) {
        res.status(200).json({
            message: 'These are the items on the catalog: ',
            items
        });
    }
    else {
        res.status(404).json({
            message: 'There are no items on the catalog'
        });
    }
});

// GET: Obtener item por ID
app.get('/items/:id', (req, res) => {
    let item = findItemById(req.params.id);
    if(item) {
        res.status(200).json({
            message: `The object with the id ${req.params.id} is: `,
            item
        });
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesn't exist`
        });
    }
});

// DELETE: Eliminar item por ID
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = findItemById(req.params.id);
    if (item) {
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            items.splice(itemIndex, 1);
        }
        res.status(200).json({
            message: `The object with the id ${req.params.id} was deleted, this is the new catalog`,
            items
        });
    }
    else {
        res.status(404).json({
            message: `The object with the id ${req.params.id} doesn't exist`
        });
    }
});

// PATCH: Actualizar item por ID
app.patch('/items/:id', (req, res) => { // Corregido: añadida la barra inicial
    const itemId = parseInt(req.params.id);
    const updates = req.body; // Campos a reemplazar
    // Buscar el índice del item
    const itemIndex = items.findIndex(item => item.id === itemId);

    if(itemIndex === -1) {
        return res.status(404).json({
            message: `The item with the id ${req.params.id} doesn't exist`
        });
    }

    // Actualizar los campos requeridos
    const updatedItem = {...items[itemIndex]};

    // Iterar sobre los campos y propiedades requeridos y actualizarlos
    for (const key in updates) {
        if (key !== 'id') {
            updatedItem[key] = updates[key];
        }
    }

    // Reemplazar el item original con el actualizado
    items[itemIndex] = updatedItem;

    res.status(200).json({
        message: `The item with the id ${req.params.id} has been updated`,
        item: updatedItem
    });
});

// ===== ENDPOINTS DE USUARIOS =====

// POST: Crear uno o más usuarios
app.post('/users', (req, res) => {
    let newUsers = req.body;
    // Convertir a array si solo se envía un objeto
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
            });
            return;
        }
        if (userExists(user)) {
            errors.push({
                user,
                message: 'The user is already registered'
            });
            return;
        }
        
        const invalidItems = [];

        if (!Array.isArray(user.items)) {
            user.items = [user.items];
        }

        for (const itemID of user.items) {
            if (!itemIdExists(itemID)) {  // Cambiado a la función correcta
                invalidItems.push(itemID);
            }
        }

        if (invalidItems.length > 0) {
            errors.push({
                user,
                message: `The following items do not exist: ${invalidItems.join(', ')}`
            });
            return;
        }
        users.push(user);
        added.push(user);
    });

    // Respuesta
    if (errors.length > 0) {
        return res.status(409).json({
            message: 'This user could not be registered',
            errors
        });
    }
    res.status(201).json({
        message: 'This user was successfully registered',
        users: added
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});