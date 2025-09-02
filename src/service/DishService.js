class DishService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }

  async getAllDishes() {
    try {
      const response = await fetch(`${this.baseURL}/dishes?status=ACTIVO`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar que la respuesta tenga la estructura esperada
      if (data.success && data.data) {
        return data.data; // Retornar solo el array de platos activos
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al obtener los platos:', error);
      throw error;
    }
  }

  async getDishById(id) {
    try {
      const response = await fetch(`${this.baseURL}/dishes/${id}?status=ACTIVO`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error al obtener el plato con ID ${id}:`, error);
      throw error;
    }
  }

  async getDishesByType(type) {
    try {
      const response = await fetch(`${this.baseURL}/dishes?status=ACTIVO&type=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error(`Error al obtener platos del tipo ${type}:`, error);
      throw error;
    }
  }
}

// Crear una instancia singleton del servicio
const dishService = new DishService();

export default dishService;