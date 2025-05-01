"use strict"

import express from "express";
import fs from 'fs';
import items from './public/js/items.js';
import users from './public/js/users.js';

const port = 3000;

const app = express();

app.use(express.json());

app.use(express.static('./public'));

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

// Función para verificar si un array de items tiene elementos
const hasItems = (array) => {
    return array.length > 0;
};

// Función para verificar si un usuario existe por ID o nombre
const userExists = (newUser) => {
    return users.some(user => user.id === newUser.id || user.name === newUser.name);
};

// Función para verificar que el array de usuarios no esté vacío
const hasUsers = (array) => {
    return array.length > 0;
};

// Función para encontrar un usuario por ID
const findUserById = (id) => {
    return users.find(user => user.id === parseInt(id));
};

// ===== RUTA A LA PAGINA =====

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
app.patch('/items/:id', (req, res) => {
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
            if (!itemIdExists(itemID)) {
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

// GET: Obtener todos los usuarios
app.get('/users', (req, res) => {
    if(hasUsers(users)) {    
        // Create copy of the users array
        const fullUsers = JSON.parse(JSON.stringify(users)); 
        
        fullUsers.forEach(user => {
            user.items = user.items.map(itemID => {
                const fullItem = items.find(item => item.id === itemID);
                return fullItem || { id: itemID, error: "Item not found" };
            });
        });
        
        res.status(200).json({
            message: 'These are the users registered: ',
            users: fullUsers
        });
    }
    else {
        res.status(404).json({
            message: 'There are no users registered'
        });
    }
});

// GET: Obtener un usuario por su ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = findUserById(userId);
    
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
        return fullItem || { id: itemId, error: "Item not found" };
    });
    
    res.status(200).json({
        message: `User with id ${userId} found`,
        user: fullUser
    });
});

// DELETE: Borrar un usuario de la lista de usuarios
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        res.status(200).json({
            message: `The user with the id ${req.params.id} was deleted, this is the new catalog`,
            users
        });
    } else {
        res.status(404).json({
            message: `The user with the id ${req.params.id} doesn't exist`
        });
    }
});

// PATCH: Actualizar un usuario por ID
app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updates = req.body; // Campos a reemplazar
    // Buscar el índice del usuario
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({
            message: `The user with the id ${req.params.id} doesn't exist`
        });
    }

    // Actualizar los campos requeridos 
    const updatedUser = {...users[userIndex]};

    // Iterar sobre los campos y propiedades requeridos y actualizarlos
    for (const key in updates) {
        if (key !== 'id') {
            updatedUser[key] = updates[key];
        }
    }

    // Reemplazar el usuario original con el actualizado
    users[userIndex] = updatedUser;

    res.status(200).json({
        message: `The user with the id ${req.params.id} has been updated`,
        user: updatedUser
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});