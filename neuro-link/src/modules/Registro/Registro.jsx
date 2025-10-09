import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

function UserTest() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    username: '', 
    age: '',
    profileType: 'autism',
    password: '',
    abilities: '',
    preferences: ''
  });

  // Cargar usuarios al iniciar
  const loadUsers = async () => {
    const userList = await userService.getUsers();
    setUsers(userList);
  };

  // Agregar nuevo usuario
  const addUser = async () => {
    if (form.name.trim() && form.username.trim()) {
      try {
        await userService.createUser({
          name: form.name,
          username: form.username,
          age: parseInt(form.age) || 0,
          profileType: form.profileType,
          password: form.password,
          abilities: form.abilities,
          preferences: form.preferences
        });
        
        // Limpiar formulario
        setForm({
          name: '',
          username: '',
          age: '',
          profileType: 'autism',
          password: '',
          abilities: '',
          preferences: ''
        });
        
        // Recargar lista
        await loadUsers();
        
      } catch (error) {
        console.error('Error creando usuario:', error);
        alert('Error al crear usuario');
      }
    } else {
      alert('El nombre y username son requeridos');
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      try {
        await userService.deleteUser(userId);
        await loadUsers();
        alert(`Usuario "${userName}" eliminado correctamente`);
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>👥 Gestión de Usuarios - Cognia</h3>
      
      {/* FORMULARIO */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h4>➕ Agregar Nuevo Usuario</h4>
        
        {/* Nombre */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Nombre Completo: *</strong></label>
          <input
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: María González"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>

        {/*CAMPO: USERNAME */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Nombre de usuario: *</strong></label>
          <input
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: maria.gonzalez"
            value={form.username}
            onChange={(e) => setForm({...form, username: e.target.value})}
          />
          <small>Este será el usuario para iniciar sesión</small>
        </div>

        {/* Edad y Tipo de Perfil en misma línea */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label><strong>Edad:</strong></label>
            <input
              type="number"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Ej: 12"
              value={form.age}
              onChange={(e) => setForm({...form, age: e.target.value})}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label><strong>Tipo de Perfil:</strong></label>
            <select
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              value={form.profileType}
              onChange={(e) => setForm({...form, profileType: e.target.value})}
            >
              <option value="autism">Autismo</option>
              <option value="intellectual">Discapacidad Intelectual</option>
              <option value="educator">Educador</option>
              <option value="parent">Padre/Madre</option>
            </select>
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Contraseña:</strong></label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ingrese la contraseña"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
        </div>

        {/* Habilidades y Fortalezas */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Habilidades y Fortalezas:</strong></label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              fontSize: '14px',
              height: '80px',
              resize: 'vertical'
            }}
            placeholder="Describa las habilidades, fortalezas y áreas de desarrollo del usuario..."
            value={form.abilities}
            onChange={(e) => setForm({...form, abilities: e.target.value})}
          />
        </div>

        {/* Preferencias y Adaptaciones */}
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Preferencias y Adaptaciones:</strong></label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              fontSize: '14px',
              height: '80px',
              resize: 'vertical'
            }}
            placeholder="Describa las preferencias, adaptaciones necesarias y apoyos..."
            value={form.preferences}
            onChange={(e) => setForm({...form, preferences: e.target.value})}
          />
        </div>

        {/* Botón */}
        <button 
          onClick={addUser}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✅ Crear Usuario
        </button>
      </div>

      {/* LISTA DE USUARIOS */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>📋 Usuarios Registrados ({users.length})</h4>
          <button 
            onClick={loadUsers}
            style={{
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            🔄 Actualizar
          </button>
        </div>
        
        {users.length === 0 ? (
          <p>No hay usuarios registrados aún</p>
        ) : (
          users.map(user => (
            <div key={user.id} style={{
              padding: '15px',
              margin: '10px 0',
              border: '1px solid #eee',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
              position: 'relative'
            }}>
              {/* BOTÓN ELIMINAR */}
              <button
                onClick={() => deleteUser(user.id, user.name)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title={`Eliminar a ${user.name}`}
              >
                🗑️ Eliminar
              </button>
              
              <div style={{ paddingRight: '80px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  👤 {user.name}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div>
                    <strong>👤 Username:</strong> {user.username || 'No definido'}
                  </div>
                  <div>
                    <strong>📅 Edad:</strong> {user.age || 'No especificada'}
                  </div>
                  <div>
                    <strong>🎯 Tipo:</strong> {getProfileTypeLabel(user.profileType)}
                  </div>
                  <div>
                    <strong>🆔 ID:</strong> {user.id}
                  </div>
                </div>

                {/* INDICADOR DE CONTRASEÑA */}
                {user.password && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>🔐 Contraseña:</strong> 
                    <span style={{ 
                      color: '#28a745',
                      marginLeft: '5px',
                      fontStyle: 'italic'
                    }}>
                      ••••••••
                    </span>
                  </div>
                )}
                
                {/* Habilidades y Fortalezas */}
                {user.abilities && user.abilities.trim() !== '' && (
                  <div style={{ marginTop: '12px' }}>
                    <strong>💪 Habilidades y Fortalezas:</strong> 
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#e8f5e8', 
                      borderRadius: '5px',
                      marginTop: '5px',
                      fontSize: '14px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4'
                    }}>
                      {user.abilities}
                    </div>
                  </div>
                )}
                
                {/* Preferencias y Adaptaciones */}
                {user.preferences && user.preferences.trim() !== '' && (
                  <div style={{ marginTop: '12px' }}>
                    <strong>⚙️ Preferencias y Adaptaciones:</strong>
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#e3f2fd', 
                      borderRadius: '5px',
                      marginTop: '5px',
                      fontSize: '14px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4'
                    }}>
                      {user.preferences}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Función auxiliar: Obtener etiqueta del tipo de perfil
function getProfileTypeLabel(profileType) {
  const labels = {
    autism: 'Autismo',
    intellectual: 'Discapacidad Intelectual',
    educator: 'Educador',
    parent: 'Padre/Madre'
  };
  return labels[profileType] || profileType;
}

// Función auxiliar: Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default UserTest;