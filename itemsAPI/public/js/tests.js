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