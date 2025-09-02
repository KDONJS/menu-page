class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api/auth';
    this.token = localStorage.getItem('authToken');
  }

  // Registro inicial
  async register(name, phoneNumber) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Verificación automática del código
  async verifyRegistration(name, phoneNumber, code) {
    try {
      const response = await fetch(`${this.baseURL}/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          code
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en verificación:', error);
      throw error;
    }
  }

  // Login
  async login(phoneNumber) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getUserProfile() {
    try {
      if (!this.token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        // Actualizar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.token;
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener token
  getToken() {
    return this.token;
  }
}

// Crear una instancia singleton del servicio
const authService = new AuthService();

export default authService;