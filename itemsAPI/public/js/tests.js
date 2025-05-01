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