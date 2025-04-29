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