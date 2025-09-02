import React, { useState, useEffect } from 'react';
import MaintenancePage from './components/mantenimiento/page';
import MenuPage from './components/MenuPage';
import Register from './components/Register';
import Cart from './components/Cart';
import dishService from './service/DishService';
import authService from './service/AuthService';
import cartService from './service/CartService';
import './App.css';

function MainApp() {
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  // Inicializar carrito cuando el usuario esté autenticado
  useEffect(() => {
    const initializeCart = async () => {
      console.log('Initializing cart, isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        try {
          // Recuperar cartId del localStorage si existe
          const savedCartId = localStorage.getItem('cartId');
          console.log('Saved cartId from localStorage:', savedCartId);
          if (savedCartId) {
            setCartId(savedCartId);
          }

          const sid = cartService.getOrCreateSessionId();
          console.log('SessionId:', sid);
          setSessionId(sid);

          const userCart = await cartService.getOrCreateUserCart();
          console.log('User cart from backend:', userCart);

          if (userCart && userCart.success && userCart.data && userCart.data.id) {
            setCartId(userCart.data.id);
            localStorage.setItem('cartId', userCart.data.id);

            // Cargar datos del carrito
            const cartData = await cartService.getCartBySession(sid);
            if (cartData) {
              const transformedCart = cartService.transformCartData(cartData);
              setCart(transformedCart.items);
            }
          }
        } catch (error) {
          console.error('Error initializing cart:', error);
        }
      }
    };

    initializeCart();
  }, [isAuthenticated]);

  // Cargar platos desde la API al montar el componente (solo si está autenticado)
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadDishes = async () => {
      try {
        setLoading(true);
        setError(null);
        const dishesData = await dishService.getAllDishes();
        setDishes(dishesData);
      } catch (err) {
        console.error('Error al cargar los platos:', err);
        setError('Error al cargar los platos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, [isAuthenticated]);

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('cartSessionId');
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    setCartId(null);
    setSessionId(null);
    setDishes([]);
  };

  // Función para refrescar el carrito desde el backend
  const refreshCart = async () => {
    try {
      setCartLoading(true);
      
      // Usar cartId si está disponible, sino usar sessionId
      let cartData;
      if (cartId) {
        // Obtener carrito por ID directamente
        const response = await fetch(`http://localhost:3001/api/cart/${cartId}`, {
          method: 'GET',
          headers: cartService.getHeaders()
        });
        if (response.ok) {
          cartData = await response.json();
        }
      } else if (sessionId) {
        cartData = await cartService.getCartBySession(sessionId);
      }
      
      if (cartData) {
        const transformedCart = cartService.transformCartData(cartData);
        setCart(transformedCart.items);
        console.log('Cart refreshed with items:', transformedCart.items);
      }
    } catch (err) {
      console.error('Error refreshing cart:', err);
    } finally {
      setCartLoading(false);
    }
  };

  // Función para agregar al carrito
  const addToCart = async (dish) => {
    console.log('addToCart called with:', dish);
    console.log('Current cartId:', cartId);
    
    let currentCartId = cartId;
    
    if (!currentCartId) {
      // Intentar crear/obtener carrito si no existe
      try {
        console.log('Creating new cart...');
        const userCart = await cartService.getOrCreateUserCart();
        console.log('Cart created:', userCart);
        
        if (userCart && userCart.success && userCart.data && userCart.data.id) {
          currentCartId = userCart.data.id;
          setCartId(currentCartId);
          localStorage.setItem('cartId', currentCartId);
        } else {
          setError('Error: No se pudo crear el carrito');
          return;
        }
      } catch (err) {
        console.error('Error creating cart:', err);
        setError('Error al crear carrito');
        return;
      }
    }

    // Validar que tenemos los datos necesarios
    if (!dish || !dish.id) {
      console.error('Dish data is invalid:', dish);
      setError('Datos del plato inválidos');
      return;
    }

    try {
      setCartLoading(true);
      
      // Determinar el tipo de item basado en el tipo de plato
      const validTypes = ['ENTRADA', 'PLATO_PRINCIPAL', 'POSTRE'];
      const itemType = validTypes.includes(dish.type) ? dish.type : 'ENTRADA';
      
      console.log('Adding to cart with params:', {
        cartId: currentCartId,
        dishId: dish.id,
        quantity: 1,
        itemType: itemType,
        dishName: dish.name,
        dishType: dish.type
      });
      
      const result = await cartService.addItemToCart(currentCartId, dish.id, 1, itemType);
      console.log('Add to cart result:', result);
      
      await refreshCart();
      
      // Mostrar mensaje de éxito
      console.log('Item agregado exitosamente al carrito');
    } catch (err) {
      console.error('Error adding to cart:', err);
      console.error('Error details:', {
        message: err.message,
        cartId: currentCartId,
        dishId: dish.id,
        dishType: dish.type
      });
      setError(`Error al agregar al carrito: ${err.message}`);
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (dishId, newQuantity) => {
    if (!cartId) return;
    
    if (newQuantity <= 0) {
      await removeFromCart(dishId);
      return;
    }
    
    try {
      setCartLoading(true);
      
      // Encontrar el item en el carrito local para obtener el cartItemId
      const cartItem = cart.find(item => item.id === dishId);
      if (!cartItem || !cartItem.cartItemId) {
        console.error('Cart item not found or missing cartItemId');
        return;
      }
      
      await cartService.updateItemQuantity(cartId, cartItem.cartItemId, newQuantity);
      await refreshCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Error al actualizar cantidad');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (dishId) => {
    if (!cartId) return;
    
    try {
      setCartLoading(true);
      
      // Encontrar el item en el carrito local para obtener el cartItemId
      const cartItem = cart.find(item => item.id === dishId);
      if (!cartItem || !cartItem.cartItemId) {
        console.error('Cart item not found or missing cartItemId');
        return;
      }
      
      await cartService.removeItemFromCart(cartId, cartItem.cartItemId);
      await refreshCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Error al eliminar del carrito');
    } finally {
      setCartLoading(false);
    }
  };

  const resetCart = async () => {
    if (!cartId) return;
    
    try {
      setCartLoading(true);
      await cartService.clearCart(cartId);
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Error al limpiar carrito');
    } finally {
      setCartLoading(false);
    }
  };

  const getDishQuantity = (dishId) => {
    const item = cart.find(item => item.id === dishId);
    return item ? item.quantity : 0;
  };

  const calculateTotals = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    const menuCount = Math.min(totalEntradas, totalPlatosPrincipales);
    const hasCompleteMenus = menuCount > 0;
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return { totalPrice, menuCount, hasCompleteMenus };
  };

  const getValidationMessage = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalEntradas === 0 && totalPlatosPrincipales === 0) {
      return "Tu carrito está vacío";
    }
    
    if (totalEntradas > totalPlatosPrincipales) {
      return `Necesitas ${totalEntradas - totalPlatosPrincipales} plato(s) principal(es) más para completar el menú`;
    }
    
    if (totalPlatosPrincipales > totalEntradas) {
      return `Necesitas ${totalPlatosPrincipales - totalEntradas} entrada(s) más para completar el menú`;
    }
    
    return "";
  };

  const { totalPrice, menuCount, hasCompleteMenus } = calculateTotals();
  const validationMessage = getValidationMessage();

  const handleShowCart = () => {
    setShowCart(true);
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  // Si no está autenticado, mostrar página de registro
  if (!isAuthenticated) {
    return <Register onAuthSuccess={handleAuthSuccess} />;
  }

  // Mostrar loading mientras se cargan los datos
  if (loading || cartLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>{loading ? 'Cargando menú...' : 'Cargando carrito...'}</p>
      </div>
    );
  }

  // Mostrar error si no se pudieron cargar los datos
  if (error && dishes.length === 0) {
    return (
      <div className="app-error">
        <h2>Error al cargar el menú</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      {showCart ? (
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          onClose={handleCloseCart}
          totalPrice={totalPrice}
          menuCount={menuCount}
          hasCompleteMenus={hasCompleteMenus}
          validationMessage={validationMessage}
          onResetCart={resetCart}
          cartLoading={cartLoading}
        />
      ) : (
        <MenuPage
          dishes={dishes}
          cart={cart}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          totalPrice={totalPrice}
          menuCount={menuCount}
          hasCompleteMenus={hasCompleteMenus}
          onResetCart={resetCart}
          onShowCart={handleShowCart}
          getDishQuantity={getDishQuantity}
          user={user}
          onLogout={handleLogout}
          cartLoading={cartLoading}
        />
      )}
    </div>
  );
}

function App() {
  // Estado para modo mantenimiento
  const isMaintenanceMode = true; // Cambia a false para desactivar

  // Renderizado condicional sin romper reglas de Hooks
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }
  return <MainApp />;
}

export default App;