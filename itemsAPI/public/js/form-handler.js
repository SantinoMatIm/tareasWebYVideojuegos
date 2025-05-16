// Add this at the top of the file
import { postItem, getItems, getItemById, deleteItem, patchItem, postUser, getUsers, getUserById, deleteUserById, patchUserById } from './tests.js';

document.addEventListener('DOMContentLoaded', function() {
  // ==== ITEM OPERATIONS ====
  
  // Create item form
  const createItemForm = document.getElementById('create-item-form');
  if (createItemForm) {
    createItemForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const newItem = {
        id: Date.now(), // In a real app, ID would be generated server-side
        name: document.getElementById('item-name').value,
        type: document.getElementById('item-type').value,
        effect: document.getElementById('item-effect').value
      };
      
      postItem(newItem);
      this.reset();
    });
  }
  
  // Get all items button
  const getItemsBtn = document.getElementById('get-items-btn');
  if (getItemsBtn) {
    getItemsBtn.addEventListener('click', function() {
      getItems();
    });
  }
  
  // Get item by ID form
  const getItemForm = document.getElementById('get-item-form');
  if (getItemForm) {
    getItemForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const itemId = document.getElementById('get-item-id').value;
      getItemById(itemId);
      this.reset();
    });
  }
  
  // Delete item form
  const deleteItemForm = document.getElementById('delete-item-form');
  if (deleteItemForm) {
    deleteItemForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const itemId = document.getElementById('delete-item-id').value;
      deleteItem(itemId);
      this.reset();
    });
  }
  
  // Update item form
  const updateItemForm = document.getElementById('update-item-form');
  if (updateItemForm) {
    updateItemForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const itemId = document.getElementById('update-item-id').value;
      const updates = {};
      
      const name = document.getElementById('update-item-name').value;
      const type = document.getElementById('update-item-type').value;
      const effect = document.getElementById('update-item-effect').value;
      
      if (name) updates.name = name;
      if (type) updates.type = type;
      if (effect) updates.effect = effect;
      
      patchItem(itemId, updates);
      this.reset();
    });
  }
  
  // ==== USER OPERATIONS ====
  
  // Create user form
const createUserForm = document.getElementById('create-user-form');
if (createUserForm) {
  createUserForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newUser = {
      id: Date.now(), // In a real app, ID would be generated server-side
      name: document.getElementById('user-name').value,
      mail: document.getElementById('user-mail').value, // Added mail
      email: document.getElementById('user-email').value,
      items: [] // Empty items array for new user
    };
    
    postUser(newUser);
    this.reset();
  });
}
  
  // Get all users button
  const getUsersBtn = document.getElementById('get-users-btn');
  if (getUsersBtn) {
    getUsersBtn.addEventListener('click', function() {
      getUsers();
    });
  }
  
  // Get user by ID form
  const getUserForm = document.getElementById('get-user-form');
  if (getUserForm) {
    getUserForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const userId = document.getElementById('get-user-id').value;
      getUserById(userId);
      this.reset();
    });
  }
  
  // Delete user form
  const deleteUserForm = document.getElementById('delete-user-form');
  if (deleteUserForm) {
    deleteUserForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const userId = document.getElementById('delete-user-id').value;
      deleteUserById(userId);
      this.reset();
    });
  }
  
  // Update user form
  const updateUserForm = document.getElementById('update-user-form');
  if (updateUserForm) {
    updateUserForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const userId = document.getElementById('update-user-id').value;
      const updates = {};
      
      const name = document.getElementById('update-user-name').value;
      const email = document.getElementById('update-user-email').value;
      const role = document.getElementById('update-user-role').value;
      
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role;
      
      patchUserById(userId, updates);
      this.reset();
    });
  }
});