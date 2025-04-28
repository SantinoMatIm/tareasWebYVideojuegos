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