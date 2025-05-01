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