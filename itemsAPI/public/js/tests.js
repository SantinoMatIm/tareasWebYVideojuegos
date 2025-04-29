function getItemById(id) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/JSON'
        }
    })
    .then(response => response.json())
    .then(data => console.log('Item retrieved: ', data))
    .catch(error => console.error('Error while getting item: ', error));
}