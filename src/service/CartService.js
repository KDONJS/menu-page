class CartService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }

  // Obtener token de autenticación
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Headers con autenticación
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Obtener perfil del usuario autenticado
  async getUserProfile() {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Crear un nuevo carrito
  async createCart(sessionId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId,
          userId
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  // Obtener carrito por userId (usando sessionId basado en userId)
  async getCartByUserId(userId) {
    try {
      const sessionId = `session-${userId}`;
      const response = await fetch(`${this.baseURL}/cart/session/${sessionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No existe carrito
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting cart by userId:', error);
      throw error;
    }
  }

  // Obtener resumen del carrito por userId
  async getCartSummaryByUserId(userId) {
    try {
      const sessionId = `session-${userId}`;
      const response = await fetch(`${this.baseURL}/cart/session/${sessionId}/summary`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No existe carrito
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting cart summary:', error);
      throw error;
    }
  }

  // Generar o obtener sessionId
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
  }

  // Obtener carrito por sessionId
  async getCartBySession(sessionId) {
    try {
      const response = await fetch(`${this.baseURL}/cart/session/${sessionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Carrito no encontrado
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting cart by session:', error);
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  // Obtener o crear carrito para el usuario autenticado
  async getOrCreateUserCart() {
    try {
      // Obtener perfil del usuario
      const profile = await this.getUserProfile();
      const userId = profile.user.id;

      // Intentar obtener carrito existente
      let cart = await this.getCartByUserId(userId);
      
      // Si no existe, crear uno nuevo con sessionId
      if (!cart) {
        const sessionId = this.getOrCreateSessionId();
        cart = await this.createCart(sessionId, userId);
      }

      return cart;
    } catch (error) {
      console.error('Error getting or creating user cart:', error);
      throw error;
    }
  }

  // Obtener resumen del carrito del usuario autenticado
  async getUserCartSummary() {
    try {
      // Obtener perfil del usuario
      const profile = await this.getUserProfile();
      const userId = profile.user.id;

      // Obtener resumen del carrito
      const summary = await this.getCartSummaryByUserId(userId);
      return summary;
    } catch (error) {
      console.error('Error getting user cart summary:', error);
      throw error;
    }
  }

  // Agregar item al carrito
  async addItemToCart(cartId, dishId, quantity, itemType, notes = '') {
    try {
      console.log('CartService.addItemToCart called with:', {
        cartId,
        dishId,
        quantity,
        itemType,
        notes
      });
      
      // Validar parámetros
      if (!cartId) {
        throw new Error('CartId is required');
      }
      if (!dishId) {
        throw new Error('DishId is required');
      }
      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (!itemType) {
        throw new Error('ItemType is required');
      }
      
      const requestBody = {
        dishId,
        quantity,
        itemType,
        notes
      };
      
      console.log('Request URL:', `${this.baseURL}/cart/${cartId}/items`);
      console.log('Request body:', requestBody);
      console.log('Request headers:', this.getHeaders());
      
      const response = await fetch(`${this.baseURL}/cart/${cartId}/items`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Actualizar cantidad de un item
  async updateItemQuantity(cartId, itemId, quantity) {
    try {
      const response = await fetch(`${this.baseURL}/cart/${cartId}/items/${itemId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          quantity
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  // Eliminar item del carrito
  async removeItemFromCart(cartId, itemId) {
    try {
      const response = await fetch(`${this.baseURL}/cart/${cartId}/items/${itemId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  // Limpiar carrito
  async clearCart(cartId) {
    try {
      const response = await fetch(`${this.baseURL}/cart/${cartId}/clear`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Transformar datos del carrito del backend
  transformCartData(backendCart) {
    if (!backendCart || !backendCart.data) {
      return {
        items: [],
        cartId: null,
        totalAmount: 0,
        itemCount: 0
      };
    }

    const data = backendCart.data;
    const items = Array.isArray(data.items)
      ? data.items.map(item => {
          const dish = item.dish || {};
          const price = parseFloat(item.price ?? dish.price ?? 0) || 0;
          return {
            id: dish.id ?? item.dishId ?? null,         // id del plato
            cartItemId: item.id,                         // id del item en carrito
            name: dish.name ?? '',
            type: dish.type ?? item.itemType ?? '',      // ENTRADA / PLATO_PRINCIPAL / POSTRE
            price: price,
            quantity: item.quantity ?? 0,
            image: dish.imageUrl ?? '',                  // Cambiado de dish.image a dish.imageUrl
            description: dish.description ?? '',         // Agregando descripción
            preparationTime: dish.preparationTime ?? 0,  // Agregando tiempo de preparación
            calories: dish.calories ?? 0                 // Agregando calorías
          };
        })
      : [];
  
    return {
      items,
      cartId: data.id ?? null,
      totalAmount: data.totalAmount ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0),
      itemCount: items.reduce((sum, it) => sum + it.quantity, 0)
    };
  }

  transformCartSummary(backendSummary) {
    if (!backendSummary || !backendSummary.data) {
      return {
        cartData: null,
        totalAmount: 0,
        itemCount: 0,
        hasCompleteMenus: false,
        cartId: null
      };
    }

    const data = backendSummary.data;
    const itemsByType = data.itemsByType || {};
    
    // Calcular totales
    const totalMenus = (itemsByType.menus || []).reduce((sum, item) => sum + item.quantity, 0);
    const hasCompleteMenus = totalMenus > 0;

    return {
      cartData: backendSummary,
      totalAmount: data.totalAmount || 0,
      itemCount: data.itemCount || 0,
      hasCompleteMenus,
      cartId: data.cart?.id
    };
  }
}

// Crear instancia y exportar
const cartService = new CartService();
export default cartService;