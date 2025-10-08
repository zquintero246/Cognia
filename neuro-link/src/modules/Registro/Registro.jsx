import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

function UserTest() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    age: '',
    profileType: 'autism',
    abilities: '{}',
    preferences: '{}'
  });

  // Cargar usuarios al iniciar
  const loadUsers = async () => {
    const userList = await userService.getUsers();
    setUsers(userList);
  };

  // Agregar nuevo usuario
  const addUser = async () => {
    if (form.name.trim()) {
      try {
        // Validar y parsear JSON fields
        let abilitiesObj = {};
        let preferencesObj = {};
        
        try {
          abilitiesObj = form.abilities ? JSON.parse(form.abilities) : {};
        } catch (e) {
          alert('Error en formato de Abilities: debe ser JSON válido');
          return;
        }
        
        try {
          preferencesObj = form.preferences ? JSON.parse(form.preferences) : {};
        } catch (e) {
          alert('Error en formato de Preferences: debe ser JSON válido');
          return;
        }

        await userService.createUser({
          name: form.name,
          age: parseInt(form.age) || 0,
          profileType: form.profileType,
          abilities: abilitiesObj,
          preferences: preferencesObj
        });
        
        // Limpiar formulario
        setForm({
          name: '',
          age: '',
          profileType: 'autism',
          abilities: '{}',
          preferences: '{}'
        });
        
        // Recargar lista
        await loadUsers();
        
      } catch (error) {
        console.error('Error creando usuario:', error);
        alert('Error al crear usuario');
      }
    } else {
      alert('El nombre es requerido');
    }
  };

  // ★ NUEVA FUNCIÓN: Eliminar usuario
  const deleteUser = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      try {
        // Primero necesitamos agregar esta función al userService
        await userService.deleteUser(userId);
        await loadUsers(); // Recargar lista después de eliminar
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
      <h3>👥 Gestión de Usuarios -  Cognia</h3>
      
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
          <label><strong>Nombre: *</strong></label>
          <input
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Ej: María González"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
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

        {/* Habilidades */}
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Habilidades (JSON):</strong></label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              fontFamily: 'monospace',
              fontSize: '12px',
              height: '60px'
            }}
            placeholder='Ej: {"motorSkills": "high", "communication": "medium"}'
            value={form.abilities}
            onChange={(e) => setForm({...form, abilities: e.target.value})}
          />
          <small>Formato JSON válido. Ejemplo: {"{}"} para vacío</small>
        </div>

        {/* Preferencias */}
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Preferencias (JSON):</strong></label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              fontFamily: 'monospace',
              fontSize: '12px',
              height: '60px'
            }}
            placeholder='Ej: {"theme": "dark", "sound": true}'
            value={form.preferences}
            onChange={(e) => setForm({...form, preferences: e.target.value})}
          />
          <small>Formato JSON válido. Ejemplo: {"{}"} para vacío</small>
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
              {/* ★ BOTÓN ELIMINAR */}
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
              
              <div style={{ paddingRight: '80px' }}> {/* Espacio para el botón */}
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  👤 {user.name}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div>
                    <strong>📅 Edad:</strong> {user.age || 'No especificada'}
                  </div>
                  <div>
                    <strong>🎯 Tipo:</strong> {getProfileTypeLabel(user.profileType)}
                  </div>
                  <div>
                    <strong>🆔 ID:</strong> {user.id}
                  </div>
                  <div>
                    <strong>📅 Creado:</strong> {formatDate(user.createdAt)}
                  </div>
                </div>
                
                {/* Habilidades */}
                {user.abilities && user.abilities !== '{}' && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>💪 Habilidades:</strong> 
                    <div style={{ 
                      padding: '5px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '3px',
                      marginTop: '3px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}>
                      {user.abilities}
                    </div>
                  </div>
                )}
                
                {/* Preferencias */}
                {user.preferences && user.preferences !== '{}' && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>⚙️ Preferencias:</strong>
                    <div style={{ 
                      padding: '5px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '3px',
                      marginTop: '3px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
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

// ★ FUNCIÓN AUXILIAR: Obtener etiqueta del tipo de perfil
function getProfileTypeLabel(profileType) {
  const labels = {
    autism: 'Autismo',
    intellectual: 'Discapacidad Intelectual',
    educator: 'Educador',
    parent: 'Padre/Madre'
  };
  return labels[profileType] || profileType;
}

// ★ FUNCIÓN AUXILIAR: Formatear fecha
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