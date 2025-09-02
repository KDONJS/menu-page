import React, { useState } from 'react';
import { X, CheckCircle, Plus, Minus, Trash2, ShoppingBag, AlertTriangle, FileText, XCircle, Utensils, BarChart3 } from 'lucide-react';
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
    
    const menusCompletos = Math.min(totalEntradas, totalPlatosPrincipales);
    
    // Crear menús emparejando entradas con platos principales
    const menus = [];
    for (let i = 0; i < menusCompletos; i++) {
      const entradaIndex = Math.floor(i * entradas.length / menusCompletos);
      const platoIndex = Math.floor(i * platosPrincipales.length / menusCompletos);
      
      const entrada = entradas[entradaIndex];
      const plato = platosPrincipales[platoIndex];
      
      menus.push({
        id: `menu-${i}`,
        entrada,
        plato,
        precio: entrada.price + plato.price
      });
    }
    
    return {
      entradas,
      platosPrincipales,
      totalEntradas,
      totalPlatosPrincipales,
      menusCompletos,
      menus,
      entradasExtra: Math.max(0, totalEntradas - totalPlatosPrincipales),
      platosExtra: Math.max(0, totalPlatosPrincipales - totalEntradas)
    };
  };

  const breakdown = getMenuBreakdown();
  
  // Calcular el total de todos los menús
  const totalMenus = breakdown.menus.reduce((sum, menu) => sum + menu.precio, 0);

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
              <Utensils size={50} className="empty-icon" />
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos platos deliciosos para comenzar</p>
            </div>
          ) : (
            <>
              {/* Resumen de menús */}
              <div className="menu-summary">
                <h3>
                  <BarChart3 size={20} />
                  Resumen del Pedido
                </h3>
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

              {/* Menús completos */}
              {breakdown.menusCompletos > 0 && (
                <div className="cart-items">
                  <h4>Menús Completos</h4>
                  {breakdown.menus.map((menu, index) => (
                    <div key={menu.id} className="menu-complete-item">
                      <div className="menu-header-2">
                        <h5 className="menu-title">
                          <Utensils size={16} />
                          Menú #{index + 1}
                        </h5>
                        <div className="menu-price">S/ {menu.precio.toFixed(2)}</div>
                      </div>
                      <div className="menu-details">
                        <div className="menu-dish">
                          <img src={menu.entrada.imageUrl} alt={menu.entrada.name} className="menu-dish-image" />
                          <div className="menu-dish-info">
                            <span className="menu-dish-name">Entrada: {menu.entrada.name}</span>
                            <span className="menu-dish-price">S/ {menu.entrada.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="menu-dish">
                          <img src={menu.plato.imageUrl} alt={menu.plato.name} className="menu-dish-image" />
                          <div className="menu-dish-info">
                            <span className="menu-dish-name">Plato: {menu.plato.name}</span>
                            <span className="menu-dish-price">S/ {menu.plato.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Items individuales (solo si hay extras) */}
              {(breakdown.entradasExtra > 0 || breakdown.platosExtra > 0) && (
                <div className="cart-items">
                  <h4>Items Individuales</h4>
                  
                  {breakdown.entradasExtra > 0 && (
                    <>
                      <h5 className="item-category">Entradas Extra</h5>
                      {breakdown.entradas.slice(breakdown.menusCompletos).map(item => (
                        <div key={item.id} className="cart-item">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-details">
                            <h5 className="cart-item-name">{item.name}</h5>
                            <p className="cart-item-description">Entrada individual</p>
                          </div>
                          
                          <div className="cart-item-controls">
                            <div className="quantity-controls">
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="quantity">{item.quantity - breakdown.menusCompletos}</span>
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            
                            <button 
                              className="remove-item"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {breakdown.platosExtra > 0 && (
                    <>
                      <h5 className="item-category">Platos Principales Extra</h5>
                      {breakdown.platosPrincipales.slice(breakdown.menusCompletos).map(item => (
                        <div key={item.id} className="cart-item">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-details">
                            <h5 className="cart-item-name">{item.name}</h5>
                            <p className="cart-item-description">Plato individual</p>
                          </div>
                          
                          <div className="cart-item-controls">
                            <div className="quantity-controls">
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="quantity">{item.quantity - breakdown.menusCompletos}</span>
                              <button 
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            
                            <button 
                              className="remove-item"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
              
              <div className="cart-footer">
                <div className="cart-total">
                  <div className="total-breakdown">
                    <div className="total-line">
                      <strong>Total: S/ {totalMenus.toFixed(2)}</strong>
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
          totalPrice={totalMenus}
          menuCount={breakdown.menusCompletos}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
};

export default Cart;