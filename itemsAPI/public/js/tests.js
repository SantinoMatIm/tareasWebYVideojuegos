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