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