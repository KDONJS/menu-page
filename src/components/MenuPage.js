import React, { useState } from 'react';
import { RotateCcw, CheckCircle, ShoppingCart } from 'lucide-react';
import DishCard from './DishCard';
import './MenuPage.css';
import TicketModal from './TicketModal';

const MenuPage = ({ 
  dishes, 
  cart, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  totalPrice, 
  menuCount, 
  hasCompleteMenus, 
  onResetCart, 
  onShowCart, 
  getDishQuantity 
}) => {
  const [showTicket, setShowTicket] = useState(false);

  const handleOrder = () => {
    if (hasCompleteMenus) {
      setShowTicket(true);
    }
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
    onResetCart();
  };

  const entradas = dishes.filter(dish => dish.type === 'ENTRADA');
  const platosPrincipales = dishes.filter(dish => dish.type === 'PLATO_PRINCIPAL');

  const getCartSummary = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    return { totalEntradas, totalPlatosPrincipales };
  };

  const { totalEntradas, totalPlatosPrincipales } = getCartSummary();

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <h1 className="menu-title">Menú del Día</h1>
              <p className="menu-subtitle">Selecciona tus platos favoritos</p>
              
              {/* Resumen del carrito */}
              <div className="cart-summary">
                <div className="summary-item">
                  <span className="summary-label">Entradas:</span>
                  <span className={`summary-value ${totalEntradas > 0 ? 'has-items' : ''}`}>
                    {totalEntradas} seleccionada(s)
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Platos Principales:</span>
                  <span className={`summary-value ${totalPlatosPrincipales > 0 ? 'has-items' : ''}`}>
                    {totalPlatosPrincipales} seleccionado(s)
                  </span>
                </div>
                {hasCompleteMenus && (
                  <div className="summary-item menu-count">
                    <span className="summary-label">Menús completos:</span>
                    <span className="summary-value complete">{menuCount}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mostrar precio y acciones cuando hay menús completos */}
            {hasCompleteMenus && (
              <div className="price-section">
                <div className="total-price">
                  <span className="price-label">Total:</span>
                  <span className="price-amount">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="action-buttons">
                  <button className="cart-button" onClick={onShowCart}>
                    <ShoppingCart size={16} />
                    Ver Carrito ({cart.length})
                  </button>
                  <button className="reset-button" onClick={onResetCart}>
                    <RotateCcw size={16} />
                    Limpiar
                  </button>
                  <button className="order-button" onClick={handleOrder}>
                    <CheckCircle size={16} />
                    Ordenar {menuCount} Menú(s)
                  </button>
                </div>
              </div>
            )}
            
            {/* Mostrar botón de limpiar si hay items pero no menús completos */}
            {cart.length > 0 && !hasCompleteMenus && (
              <div className="partial-selection">
                <p className="incomplete-message">
                  Agrega más platos para completar tus menús
                </p>
                <button className="reset-button" onClick={onResetCart}>
                  <RotateCcw size={16} />
                  Limpiar Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        <div className="menu-content">
          {entradas.length > 0 && (
            <section className="menu-section">
              <h2 className="section-title">Entradas</h2>
              <div className="dishes-grid">
                {entradas.map(dish => (
                  <DishCard 
                    key={dish.id}
                    dish={dish}
                    quantity={getDishQuantity(dish.id)}
                    onAddToCart={onAddToCart}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveFromCart={onRemoveFromCart}
                  />
                ))}
              </div>
            </section>
          )}

          {platosPrincipales.length > 0 && (
            <section className="menu-section">
              <h2 className="section-title">Platos Principales</h2>
              <div className="dishes-grid">
                {platosPrincipales.map(dish => (
                  <DishCard 
                    key={dish.id}
                    dish={dish}
                    quantity={getDishQuantity(dish.id)}
                    onAddToCart={onAddToCart}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveFromCart={onRemoveFromCart}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {showTicket && (
        <TicketModal
          isOpen={showTicket}
          cart={cart}
          totalPrice={totalPrice}
          menuCount={menuCount}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
};

export default MenuPage;