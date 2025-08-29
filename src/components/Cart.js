import React, { useState } from 'react';
import { X, CheckCircle, Plus, Minus, Trash2, ShoppingBag, AlertTriangle, FileText, XCircle } from 'lucide-react';
import './Cart.css';
import TicketModal from './TicketModal';

const Cart = ({ 
  cart, 
  onClose, 
  updateQuantity, 
  removeFromCart, 
  totalPrice, 
  menuCount,
  hasCompleteMenus,
  validationMessage,
  onResetCart
}) => {
  const [showTicket, setShowTicket] = useState(false);

  const handleOrder = () => {
    if (!hasCompleteMenus) {
      return;
    }
    setShowTicket(true);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
    onResetCart();
    onClose();
  };

  const getMenuBreakdown = () => {
    const entradas = cart.filter(item => item.type === 'ENTRADA');
    const platosPrincipales = cart.filter(item => item.type === 'PLATO_PRINCIPAL');
    
    const totalEntradas = entradas.reduce((sum, item) => sum + item.quantity, 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      entradas,
      platosPrincipales,
      totalEntradas,
      totalPlatosPrincipales,
      menusCompletos: Math.min(totalEntradas, totalPlatosPrincipales),
      entradasExtra: Math.max(0, totalEntradas - totalPlatosPrincipales),
      platosExtra: Math.max(0, totalPlatosPrincipales - totalEntradas)
    };
  };

  const breakdown = getMenuBreakdown();

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <h2>Tu Pedido</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🍽️</div>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos platos deliciosos para comenzar</p>
            </div>
          ) : (
            <>
              {/* Resumen de menús */}
              <div className="menu-summary">
                <h3>Resumen del Pedido</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Menús completos:</span>
                    <span className="stat-value complete">{breakdown.menusCompletos}</span>
                  </div>
                  {breakdown.entradasExtra > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Entradas extra:</span>
                      <span className="stat-value extra">{breakdown.entradasExtra}</span>
                    </div>
                  )}
                  {breakdown.platosExtra > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Platos extra:</span>
                      <span className="stat-value extra">{breakdown.platosExtra}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de items */}
              <div className="cart-items">
                <h4>Entradas</h4>
                {breakdown.entradas.length > 0 ? (
                  breakdown.entradas.map(item => (
                    <div key={item.id} className="cart-item">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h5 className="cart-item-name">{item.name}</h5>
                        <p className="cart-item-price">S/ {item.price.toFixed(2)} c/u</p>
                      </div>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        <div className="item-total">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <button 
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No hay entradas seleccionadas</p>
                )}

                <h4>Platos Principales</h4>
                {breakdown.platosPrincipales.length > 0 ? (
                  breakdown.platosPrincipales.map(item => (
                    <div key={item.id} className="cart-item">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h5 className="cart-item-name">{item.name}</h5>
                        <p className="cart-item-price">S/ {item.price.toFixed(2)} c/u</p>
                      </div>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        <div className="item-total">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <button 
                          className="remove-item"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No hay platos principales seleccionados</p>
                )}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <div className="total-breakdown">
                    <div className="total-line">
                      <strong>Total: S/ {totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="cart-actions">
                  {hasCompleteMenus ? (
                    <button className="checkout-button" onClick={handleOrder}>
                      <CheckCircle size={16} />
                      Confirmar {breakdown.menusCompletos} Menú(s) Completo(s)
                    </button>
                  ) : (
                    <div className="incomplete-order-actions">
                      <div className="validation-message">
                        <p className="incomplete-message">
                          <AlertTriangle size={16} className="warning-icon" />
                          {validationMessage}
                        </p>
                        <div className="validation-details">
                          <small>
                            <FileText size={14} className="rule-icon" />
                            <strong>Regla:</strong> Cada menú debe tener exactamente 1 entrada + 1 plato principal.
                            <br />
                            <XCircle size={14} className="restriction-icon" />
                            No se permiten platos sueltos en el pedido.
                          </small>
                        </div>
                      </div>
                      <button className="clear-button" onClick={onResetCart}>
                        <Trash2 size={16} />
                        Limpiar Carrito
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
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

export default Cart;