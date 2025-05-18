<template>
  <div class="manage-user">
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>

    <h1>Manage Users</h1>

    <div class="actions">
      <button class="refresh-button" @click="fetchUsers">Refresh Users</button>
    </div>

    <div v-if="users.length === 0" class="no-users">No users found.</div>
    <ul v-else class="user-list">
      <li v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <strong>{{ user.username }}</strong> — Role: {{ user.role || 'Undefined' }}
        </div>
        <div>
          <button v-if="user.role !== 'admin'" @click="removeUser(user.id)">Delete User</button>
          <span v-else class="admin-tag">Admin (Not deletable)</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/api';


export default {
  name: 'ManageUsers',
  data() {
    return {
      users: [],
      message: '',
      messageType: '',
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    showMessage(message, type) {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/users`);
        this.users = response.data || [];
      } catch (error) {
        console.error('Error fetching users:', error);
        this.showMessage('Error loading users.', 'error');
      }
    },
    async removeUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await axios.delete(`${API_URL}/users/${userId}`);
          this.showMessage('User deleted successfully!', 'success');
          this.fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          this.showMessage('Error deleting user.', 'error');
        }
      }
    },
  },
};
</script>

<style scoped>
.manage-user {
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
  text-align: right;
}

.refresh-button {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.refresh-button:hover {
  background-color: #138496;
}

.message {
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
}

.message.success {
  background-color: #28a745;
  color: white;
}

.message.error {
  background-color: #dc3545;
  color: white;
}

.no-users {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 12px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.user-info {
  font-size: 18px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.admin-tag {
  font-style: italic;
  color: gray;
}
</style>
