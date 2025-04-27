const items = [
    {
        id: 1,
        name: 'fireball',
        type: 'zone',
        effect: '+5 zone damage'
    }
]

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