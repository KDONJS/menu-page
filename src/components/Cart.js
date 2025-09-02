import React, { useState } from 'react';
import { X, CheckCircle, Plus, Minus, Trash2, ShoppingBag, AlertTriangle, Utensils, BarChart3 } from 'lucide-react';
import './Cart.css';
import TicketModal from './TicketModal';

const Cart = ({ 
  cart,            // Array de items del carrito desde el backend
  cartData,        // Datos crudos del carrito (opcional)
  cartLoading,
  onClose, 
  updateQuantity, 
  removeFromCart, 
  onResetCart,
  error
}) => {
  const [showTicket, setShowTicket] = useState(false);

  const effectiveLoading = !!cartLoading;
  const effectiveError = error || null;

  // DEBUG: Imprimir TODA la respuesta de la API
  console.log('=== CART DEBUG - RESPUESTA COMPLETA DE LA API ===');
  console.log('cart prop:', cart);
  console.log('cartData prop:', cartData);
  console.log('cart type:', typeof cart);
  console.log('cart isArray:', Array.isArray(cart));
  console.log('cartData type:', typeof cartData);
  
  if (cartData) {
    console.log('cartData.success:', cartData.success);
    console.log('cartData.data:', cartData.data);
    if (cartData.data) {
      console.log('cartData.data.items:', cartData.data.items);
      console.log('cartData.data.items length:', cartData.data.items?.length);
      if (cartData.data.items && cartData.data.items.length > 0) {
        console.log('PRIMER ITEM COMPLETO:', JSON.stringify(cartData.data.items[0], null, 2));
      }
    }
  }
  
  if (Array.isArray(cart) && cart.length > 0) {
    console.log('CART ARRAY - PRIMER ITEM:', JSON.stringify(cart[0], null, 2));
  }
  console.log('=== FIN CART DEBUG ===');

  const handleOrder = async () => {
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

  // Handle loading state
  if (effectiveLoading) {
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
            <div className="loading-state">
              <p>Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (effectiveError) {
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
            <div className="error-state">
              <AlertTriangle size={50} className="error-icon" />
              <h3>Error al cargar el carrito</h3>
              <p>{String(effectiveError)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normalizar items del carrito desde el backend
  let cartItems = [];
  if (Array.isArray(cart)) {
    cartItems = cart;
  } else if (cartData?.data?.items) {
    cartItems = cartData.data.items;
  }

  console.log('[Cart] cartItems finales:', cartItems);
  console.log('[Cart] cartItems length:', cartItems.length);

  // Función para obtener el tipo de item desde el backend
  const getItemType = (item) => {
    return item.itemType || item.dish?.type || 'OTRO';
  };

  // Total y conteos
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || parseFloat(item.dish?.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  const getMenuBreakdown = () => {
    const entradas = cartItems.filter(item => getItemType(item) === 'ENTRADA');
    const menus = cartItems.filter(item => getItemType(item) === 'MENU');
    const platosPrincipales = cartItems.filter(item => getItemType(item) === 'PLATO_PRINCIPAL');
    const postres = cartItems.filter(item => getItemType(item) === 'POSTRE');

    const totalEntradas = entradas.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const totalMenus = menus.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const totalPlatosPrincipales = platosPrincipales.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    const totalPostres = postres.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    return {
      entradas,
      menus,
      platosPrincipales,
      postres,
      totalEntradas,
      totalMenus,
      totalPlatosPrincipales,
      totalPostres,
      hasCompleteMenus: totalMenus > 0 || (totalEntradas > 0 && totalPlatosPrincipales > 0)
    };
  };

  const breakdown = getMenuBreakdown();
  const hasCompleteMenus = breakdown.hasCompleteMenus;
  
  // Calculate total item count
  const itemCount = cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const renderCartItem = (item) => {
    // DEBUG: Imprimir cada item completo
    console.log('=== RENDERIZANDO ITEM ===');
    console.log('Item completo:', JSON.stringify(item, null, 2));
    
    // Los datos ya están transformados por CartService, usar directamente
    const itemId = item.cartItemId; // ID del item en el carrito
    const dishId = item.id; // ID del plato
    const dishName = item.name;
    
    // Precio y cantidad
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    
    // Imagen: usar directamente la imagen transformada
    const imageUrl = item.image || '/img/IMG_0366.jpg';
    
    console.log('[Cart] Rendering item DETALLES:', {
      itemId,
      dishId,
      dishName,
      imageUrl,
      originalImageUrl: item.image,
      price,
      quantity,
      itemType: getItemType(item)
    });
    console.log('=== FIN RENDERIZADO ITEM ===');
  
    return (
      <div key={itemId} className="cart-item">
        <img 
          src={imageUrl} 
          alt={dishName || 'Plato'}
          className="cart-item-image"
          onLoad={() => console.log('[Cart] Imagen cargada exitosamente:', imageUrl)}
          onError={(e) => {
            console.log('[Cart] Error cargando imagen:', imageUrl);
            e.target.src = '/img/IMG_0366.jpg';
          }}
        />
        <div className="cart-item-details">
          <h4 className="cart-item-name">{dishName}</h4>
          <p className="cart-item-description">{item.description}</p>
          <div className="cart-item-info">
            <span className="cart-item-type">{getItemType(item)}</span>
            <span className="cart-item-price">S/ {price.toFixed(2)}</span>
          </div>
        </div>
        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button 
              className="quantity-btn" 
              onClick={() => handleUpdateQuantity(itemId, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="quantity">{quantity}</span>
            <button 
              className="quantity-btn" 
              onClick={() => handleUpdateQuantity(itemId, quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button 
            className="remove-btn"
            onClick={() => handleRemoveItem(itemId)}
            title="Eliminar item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  const groupItemsByType = () => {
    const grouped = {
      menus: cartItems.filter(item => getItemType(item) === 'MENU'),
      entradas: cartItems.filter(item => getItemType(item) === 'ENTRADA'),
      platosPrincipales: cartItems.filter(item => getItemType(item) === 'PLATO_PRINCIPAL'),
      postres: cartItems.filter(item => getItemType(item) === 'POSTRE'),
      otros: cartItems.filter(item => !['MENU', 'ENTRADA', 'PLATO_PRINCIPAL', 'POSTRE'].includes(getItemType(item)))
    };
    
    console.log('[Cart] Items agrupados:', grouped);
    return grouped;
  };

  const groupedItems = groupItemsByType();

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
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <Utensils size={50} className="empty-icon" />
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos platos deliciosos para comenzar</p>
              <div style={{marginTop: '20px', padding: '10px', background: '#f0f0f0', fontSize: '12px'}}>
                <strong>DEBUG INFO:</strong><br/>
                cart prop: {JSON.stringify(cart)}<br/>
                cartData prop: {JSON.stringify(cartData)}<br/>
              </div>
            </div>
          ) : (
            <>
              {/* Resumen de pedido */}
              <div className="menu-summary">
                <h3>
                  <BarChart3 size={20} />
                  Resumen del Pedido
                </h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total de items:</span>
                    <span className="stat-value">{itemCount}</span>
                  </div>
                  {breakdown.totalMenus > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Menús completos:</span>
                      <span className="stat-value complete">{breakdown.totalMenus}</span>
                    </div>
                  )}
                  {breakdown.totalEntradas > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Entradas:</span>
                      <span className="stat-value">{breakdown.totalEntradas}</span>
                    </div>
                  )}
                  {breakdown.totalPlatosPrincipales > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Platos Principales:</span>
                      <span className="stat-value">{breakdown.totalPlatosPrincipales}</span>
                    </div>
                  )}
                  {breakdown.totalPostres > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Postres:</span>
                      <span className="stat-value">{breakdown.totalPostres}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Menús completos */}
              {groupedItems.menus.length > 0 && (
                <div className="cart-items">
                  <h4>Menús Completos</h4>
                  {groupedItems.menus.map((item) => renderCartItem(item))}
                </div>
              )}

              {/* Entradas */}
              {groupedItems.entradas.length > 0 && (
                <div className="cart-items">
                  <h4>Entradas</h4>
                  {groupedItems.entradas.map((item) => renderCartItem(item))}
                </div>
              )}

              {/* Platos Principales */}
              {groupedItems.platosPrincipales.length > 0 && (
                <div className="cart-items">
                  <h4>Platos Principales</h4>
                  {groupedItems.platosPrincipales.map((item) => renderCartItem(item))}
                </div>
              )}

              {/* Postres */}
              {groupedItems.postres.length > 0 && (
                <div className="cart-items">
                  <h4>Postres</h4>
                  {groupedItems.postres.map((item) => renderCartItem(item))}
                </div>
              )}

              {/* Otros items */}
              {groupedItems.otros.length > 0 && (
                <div className="cart-items">
                  <h4>Otros Items</h4>
                  {groupedItems.otros.map((item) => renderCartItem(item))}
                </div>
              )}
              
              <div className="cart-footer">
                <div className="cart-total">
                  <div className="total-breakdown">
                    <div className="total-line">
                      <strong>Total: S/ {totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="cart-actions">
                  {cartItems.length > 0 ? (
                    <button className="checkout-button" onClick={handleOrder}>
                      <CheckCircle size={16} />
                      Confirmar Pedido ({itemCount} items)
                    </button>
                  ) : (
                    <div className="incomplete-order-actions">
                      <div className="validation-message">
                        <p className="incomplete-message">
                          <AlertTriangle size={16} className="warning-icon" />
                          Agrega productos para continuar
                        </p>
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
          cart={cartItems}
          totalPrice={totalAmount}
          menuCount={breakdown.totalMenus}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
};

export default Cart;