import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, LogOut, RefreshCw, User } from 'lucide-react';
import authService from '../service/AuthService';
import './UserProfile.css';

const UserProfile = ({ onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.getUserProfile();
      if (response.success) {
        setUserProfile(response.user);
      }
    } catch (err) {
      setError('Error al cargar el perfil del usuario');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Recargar datos cuando se abre el modal
  useEffect(() => {
    if (isVisible) {
      fetchUserProfile();
    }
  }, [isVisible]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const getFirstName = () => {
    if (!userProfile || !userProfile.name) return 'Usuario';
    return userProfile.name.split(' ')[0];
  };

  const getInitial = () => {
    if (!userProfile || !userProfile.name) return 'U';
    return userProfile.name.charAt(0).toUpperCase();
  };

  if (!isVisible) {
    return (
      <button 
        className="profile-toggle-button"
        onClick={() => setIsVisible(true)}
      >
        <div className="profile-initial-circle">
          {getInitial()}
        </div>
        {getFirstName()}
      </button>
    );
  }

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-modal">
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-large">
              {getInitial()}
            </div>
            <div className="profile-header-info">
              <h2>{getFirstName()}</h2>
              <p className="profile-subtitle">Perfil de usuario</p>
            </div>
          </div>
          <button 
            className="close-button-p"
            onClick={() => setIsVisible(false)}
          >
            ×
          </button>
        </div>

        <div className="profile-content">
          {loading && (
            <div className="loading-section">
              <RefreshCw className="spinning" size={32} />
              <p>Cargando perfil...</p>
            </div>
          )}

          {error && (
            <div className="error-section">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button onClick={fetchUserProfile} className="retry-button">
                <RefreshCw size={16} />
                Reintentar
              </button>
            </div>
          )}

          {userProfile && !loading && (
            <div className="profile-info">
              <div className="profile-card">
                <div className="profile-item">
                  <div className="profile-item-icon">
                    <User size={20} />
                  </div>
                  <div className="profile-details">
                    <label>Nombre completo</label>
                    <span>{userProfile.name}</span>
                  </div>
                </div>

                <div className="profile-item">
                  <div className="profile-item-icon">
                    <Phone size={20} />
                  </div>
                  <div className="profile-details">
                    <label>Teléfono</label>
                    <span>{userProfile.phoneNumber}</span>
                  </div>
                </div>

                <div className="profile-item">
                  <div className="profile-item-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="profile-details">
                    <label>Miembro desde</label>
                    <span>{formatDate(userProfile.createdAt)}</span>
                  </div>
                </div>

                <div className="profile-item">
                  <div className="profile-item-icon">
                    <Clock size={20} />
                  </div>
                  <div className="profile-details">
                    <label>Último acceso</label>
                    <span>{formatDate(userProfile.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button onClick={fetchUserProfile} className="refresh-button">
            <RefreshCw size={18} />
            Actualizar
          </button>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;