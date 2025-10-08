import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

function UserTest() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  const loadUsers = async () => {
    const userList = await userService.getUsers();
    setUsers(userList);
  };

  const addUser = async () => {
    if (name.trim()) {
      await userService.createUser({
        name: name,
        age: 25, // Ejemplo
        profileType: 'autism',
        abilities: {},
        preferences: {}
      });
      setName('');
      await loadUsers(); // Recargar lista
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔧 Prueba de Usuarios</h3>
      
      <div>
        <input
          placeholder="Nombre de usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addUser()}
        />
        <button onClick={addUser}>Agregar Usuario</button>
      </div>

      <div>
        <h4>Usuarios en DB:</h4>
        {users.map(user => (
          <div key={user.id}>
            ✅ {user.name} (ID: {user.id})
          </div>
        ))}
        {users.length === 0 && <p>No hay usuarios aún</p>}
      </div>

      <button onClick={loadUsers}>🔄 Actualizar lista</button>
    </div>
  );
}

export default UserTest;