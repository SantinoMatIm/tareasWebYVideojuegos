function getResultsContainer(id = 'api-results') {
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.className = 'results-container';
    document.body.appendChild(container);
  }
  return container;
}

function postItem (item) {
  let resultsDiv = getResultsContainer('items-result');
  resultsDiv.innerHTML = '<p>Adding item...</p>';
    fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-type': 'application/JSON'
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(data => {
        resultsDiv.innerHTML = `
        <h3>Item Added</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
        console.log('Item Added: ', data);
    })
    .catch(error => {
      resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error while adding item: ${error.message}</p>
      `;
      console.error('Error while adding item: ', error);
    });
}

function getItems() {
  let resultsDiv = getResultsContainer('items-result');
  resultsDiv.innerHTML = '<p>Loading items...</p>';
  
  fetch('http://localhost:3000/items', {
    method: 'GET',
    headers: {
      'Content-type': 'application/JSON'
    }
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>Items Retrieved</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('Items retrieved: ', data);
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error while getting items: ${error.message}</p>
    `;
    console.error('Error while getting items: ', error);
  });
}

function getItemById(id) {
  let resultsDiv = getResultsContainer('items-result');
  resultsDiv.innerHTML = `<p>Loading item with ID ${id}...</p>`;
  
  fetch(`http://localhost:3000/items/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/JSON'
    }
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>Item Retrieved</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('Items retrieved: ', data);
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error while getting item: ${error.message}</p>
    `;
    console.error('Error while getting items: ', error);
  });
}

function deleteItem(id) {
  let resultsDiv = getResultsContainer('items-result');
  resultsDiv.innerHTML = `<p>Deleting item with ID ${id}...</p>`;
  
  fetch(`http://localhost:3000/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/JSON'
    }
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>Item Deleted</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('Item Deleted: ', data);
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error while deleting item: ${error.message}</p>
    `;
    console.error('Error while deleting item: ', error);
  });
}

function patchItem(id, updates) {
  let resultsDiv = getResultsContainer('items-result');
  resultsDiv.innerHTML = `<p>Updating item with ID ${id}...</p>`;
  
  fetch(`http://localhost:3000/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/JSON'
    },
    body: JSON.stringify(updates)
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>Item Updated</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('Item Updated: ', data);
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error while updating item: ${error.message}</p>
    `;
    console.error('Error while updating item: ', error);
  });
}

function postUser(user) {
  let resultsDiv = getResultsContainer('users-result');
  resultsDiv.innerHTML = '<p>Adding user...</p>';
  
  return fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>User Added</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('User creation response:', data);
    return data;
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error creating user: ${error.message}</p>
    `;
    console.error('Error creating user:', error);
    return { error: error.message };
  });
}

function getUsers() {
  let resultsDiv = getResultsContainer('users-result');
  resultsDiv.innerHTML = '<p>Loading users...</p>';
  
  return fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = `
        <h3>Users Retrieved</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `;
      console.log('Users retrieved:', data);
      return data;
    })
    .catch(error => {
      resultsDiv.innerHTML = `
        <h3>Error</h3>
        <p>Error getting users: ${error.message}</p>
      `;
      console.error('Error getting users:', error);
      return { error: error.message };
    });
}

function getUserById(id) {
  let resultsDiv = getResultsContainer('users-result');
  resultsDiv.innerHTML = `<p>Loading user with ID ${id}...</p>`;
  
  return fetch(`http://localhost:3000/users/${id}`)
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = `
        <h3>User Retrieved</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `;
      console.log('User retrieved:', data);
      return data;
    })
    .catch(error => {
      resultsDiv.innerHTML = `
        <h3>Error</h3>
        <p>Error getting user: ${error.message}</p>
      `;
      console.error('Error getting user:', error);
      return { error: error.message };
    });
}

function deleteUserById(id) {
  let resultsDiv = getResultsContainer('users-result');
  resultsDiv.innerHTML = `<p>Deleting user with ID ${id}...</p>`;
  
  return fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = `
        <h3>User Deleted</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `;
      console.log('User deletion response:', data);
      return data;
    })
    .catch(error => {
      resultsDiv.innerHTML = `
        <h3>Error</h3>
        <p>Error deleting user: ${error.message}</p>
      `;
      console.error('Error deleting user:', error);
      return { error: error.message };
    });
}

function patchUserById(id, updates) {
  let resultsDiv = getResultsContainer('users-result');
  resultsDiv.innerHTML = `<p>Updating user with ID ${id}...</p>`;
  
  return fetch(`http://localhost:3000/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  })
  .then(response => response.json())
  .then(data => {
    resultsDiv.innerHTML = `
      <h3>User Updated</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    console.log('User update response:', data);
    return data;
  })
  .catch(error => {
    resultsDiv.innerHTML = `
      <h3>Error</h3>
      <p>Error updating user: ${error.message}</p>
    `;
    console.error('Error updating user:', error);
    return { error: error.message };
  });
}

// Add this at the end of your tests.js file
export { postItem, getItems, getItemById, deleteItem, patchItem, postUser, getUsers, getUserById, deleteUserById, patchUserById };