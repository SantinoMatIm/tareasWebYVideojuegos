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

getItems();
