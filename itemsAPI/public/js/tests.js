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