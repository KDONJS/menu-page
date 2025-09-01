import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import './DishCard.css';

const DishCard = ({ 
  dish, 
  quantity = 0, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart 
}) => {
  const handleAdd = () => {
    onAddToCart(dish);
  };

  const handleIncrease = () => {
    onUpdateQuantity(dish.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(dish.id, quantity - 1);
    } else {
      onRemoveFromCart(dish.id);
    }
  };

  const handleRemove = () => {
    onRemoveFromCart(dish.id);
  };

  return (
    <div className={`dish-card ${quantity > 0 ? 'selected' : ''}`}>
      <div className="dish-image-container">
        <img 
          src={dish.imageUrl} 
          alt={dish.name}
          className="dish-image"
        />
        {quantity > 0 && (
          <div className="quantity-badge">
            {quantity}
          </div>
        )}
      </div>
      
      <div className="dish-content">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-description">{dish.description}</p>
        
        <div className="dish-footer">
          
          <div className="dish-controls">
            {quantity === 0 ? (
              <button className="add-button" onClick={handleAdd}>
                <Plus size={16} />
                Agregar
              </button>
            ) : (
              <div className="quantity-controls">
                <button className="quantity-btn decrease" onClick={handleDecrease}>
                  <Minus size={14} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-btn increase" onClick={handleIncrease}>
                  <Plus size={14} />
                </button>
                <button className="remove-btn" onClick={handleRemove}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;