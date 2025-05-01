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

function postUser(user) {
    return fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
      console.log('User creation response:', data);
      return data;
    })
    .catch(error => {
      console.error('Error creating user:', error);
      return { error: error.message };
    });
  }
function getUsers() {
    return fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
        console.log('Users retrieved:', data);
        return data;
      })
      .catch(error => {
        console.error('Error getting users:', error);
        return { error: error.message };
      });
  }
function getUserById(id) {
    return fetch(`http://localhost:3000/users/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('User retrieved:', data);
        return data;
      })
      .catch(error => {
        console.error('Error getting user:', error);
        return { error: error.message };
      });
  }
function deleteUserById(id) {
    return fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('User deletion response:', data);
        return data;
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        return { error: error.message };
      });
  }
function patchUserById(id, updates) {
    return fetch(`http://localhost:3000/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    .then(response => response.json())
    .then(data => {
      console.log('User update response:', data);
      return data;
    })
    .catch(error => {
      console.error('Error updating user:', error);
      return { error: error.message };
    });
  }
