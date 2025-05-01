function postItem (item) {
    fetch('http://localhost:3000/createitem', {
        method: 'POST',
        headers: {
            'Content-type': 'application/JSON'
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(data => console.log('Item Added: ', data))
    .catch(error => console.error('Error while adding item: ', error));
}

function getItems() {
    fetch('http://localhost:3000/items', {
        method: 'GET',
        headers: {
            'Content-type': 'application/JSON'
        }
    })
    .then(response => response.json())
    .then(data => console.log('Items retrieved: ', data))
    .catch(error => console.error('Error while getting items: ', error));
}

function getItemById(id) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/JSON'
        }
    })
    .then(response => response.json())
    .then(data => console.log('Items retrieved: ', data))
    .catch(error => console.error('Error while getting items: ', error));
}

function deleteItem(id) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/JSON'
        }
    })
    .then(response => response.json())
    .then(data => console.log('Item Deleted: ', data))
    .catch(error => console.error('Error while deleting item: ', error));
}

function patchItem(id, updates) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/JSON'
        },
        body: JSON.stringify(updates)
    })
    .then(response => response.json())
    .then(data => console.log('Item Updated: ', data))
    .catch(error => console.error('Error while updating item: ', error));
}