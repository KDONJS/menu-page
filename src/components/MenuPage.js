import React, { useState } from 'react';
import { RotateCcw, CheckCircle, ShoppingCart, Utensils } from 'lucide-react';
import DishCard from './DishCard';
import UserProfile from './UserProfile';
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

  const handleLogout = () => {
    // Limpiar carrito al cerrar sesión
    onResetCart();
    // Recargar la página para volver al login
    window.location.reload();
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
      <header className="menu-header-main">
        <div className="container">
          <div className="header-content">
            {/* Logo/Icono a la izquierda */}
            <div className="logo-section">
              <div className="logo-icon">
                <Utensils size={32} />
              </div>
              <div className="logo-text">
                <h1 className="menu-title">La Sazón de Lucqa</h1>
              </div>
            </div>
            
            {/* Resumen del pedido en el centro (compacto) */}
            <div className="order-summary">
              <div className="summary-compact">
                <span className="summary-item-compact">
                  <span className="summary-label-compact">Entradas:</span>
                  <span className={`summary-value-compact ${totalEntradas > 0 ? 'has-items' : ''}`}>
                    {totalEntradas}
                  </span>
                </span>
                <span className="summary-item-compact">
                  <span className="summary-label-compact">Principales:</span>
                  <span className={`summary-value-compact ${totalPlatosPrincipales > 0 ? 'has-items' : ''}`}>
                    {totalPlatosPrincipales}
                  </span>
                </span>
                {hasCompleteMenus && (
                  <span className="summary-item-compact menu-complete">
                    <span className="summary-label-compact">Menús:</span>
                    <span className="summary-value-compact complete">{menuCount}</span>
                  </span>
                )}
                {hasCompleteMenus && (
                  <span className="summary-item-compact total-price-inline">
                    <span className="summary-label-compact">Total:</span>
                    <span className="price-amount-inline">S/ {totalPrice.toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Botones de acción a la derecha */}
            <div className="actions-section">
              {hasCompleteMenus ? (
                <div className="action-buttons">
                  <button className="cart-button" onClick={onShowCart}>
                    <ShoppingCart size={16} />
                    Carrito ({cart.length})
                  </button>
                  <button className="reset-button" onClick={onResetCart}>
                    <RotateCcw size={16} />
                    Limpiar
                  </button>
                  <button className="order-button" onClick={handleOrder}>
                    <CheckCircle size={16} />
                    Ordenar
                  </button>
                  <UserProfile onLogout={handleLogout} />
                </div>
              ) : cart.length > 0 ? (
                <div className="action-buttons">
                  <button className="reset-button" onClick={onResetCart}>
                    <RotateCcw size={16} />
                    Limpiar
                  </button>
                  <UserProfile onLogout={handleLogout} />
                </div>
              ) : (
                <div className="action-buttons">
                  <UserProfile onLogout={handleLogout} />
                </div>
              )}
            </div>
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