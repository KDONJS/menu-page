import React, { useState, useEffect } from 'react';
import './App.css';
import MenuPage from './components/MenuPage';
import Cart from './components/Cart';
import platosData from './data/platos.json';

function App() {
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    setDishes(platosData.data);
  }, []);

  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...dish, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (dishId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === dishId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (dishId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== dishId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getMenuCount = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    return Math.min(totalEntradas, totalPlatosPrincipales);
  };

  const hasCompleteMenus = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    // Solo permitir pedido si las cantidades son exactamente iguales (sin platos sueltos)
    return totalEntradas > 0 && totalEntradas === totalPlatosPrincipales;
  };

  const getValidationMessage = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalEntradas === 0 && totalPlatosPrincipales === 0) {
      return "Agrega al menos una entrada y un plato principal para formar un menú completo";
    }
    
    if (totalEntradas === 0) {
      return `Necesitas agregar ${totalPlatosPrincipales} entrada(s) para completar tu(s) menú(s)`;
    }
    
    if (totalPlatosPrincipales === 0) {
      return `Necesitas agregar ${totalEntradas} plato(s) principal(es) para completar tu(s) menú(s)`;
    }
    
    if (totalEntradas > totalPlatosPrincipales) {
      const diferencia = totalEntradas - totalPlatosPrincipales;
      return `Tienes ${diferencia} entrada(s) extra. Agrega ${diferencia} plato(s) principal(es) más o reduce las entradas`;
    }
    
    if (totalPlatosPrincipales > totalEntradas) {
      const diferencia = totalPlatosPrincipales - totalEntradas;
      return `Tienes ${diferencia} plato(s) principal(es) extra. Agrega ${diferencia} entrada(s) más o reduce los platos principales`;
    }
    
    return "";
  };

  const resetCart = () => {
    setCart([]);
  };

  const getDishQuantity = (dishId) => {
    const item = cart.find(item => item.id === dishId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="App">
      <MenuPage 
        dishes={dishes}
        cart={cart}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        totalPrice={getTotalPrice()}
        menuCount={getMenuCount()}
        hasCompleteMenus={hasCompleteMenus()}
        validationMessage={getValidationMessage()}
        onResetCart={resetCart}
        onShowCart={() => setShowCart(true)}
        getDishQuantity={getDishQuantity}
      />
      
      {showCart && (
        <Cart 
          cart={cart}
          onClose={() => setShowCart(false)}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          totalPrice={getTotalPrice()}
          menuCount={getMenuCount()}
          hasCompleteMenus={hasCompleteMenus()}
          validationMessage={getValidationMessage()}
          onResetCart={resetCart}
        />
      )}
    </div>
  );
}

export default App;