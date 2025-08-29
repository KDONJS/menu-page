import React, { useState } from 'react';
import { CheckCircle, X, Calendar, Clock, Receipt, Smartphone, Copy, Check } from 'lucide-react';
import './TicketModal.css';

const TicketModal = ({ 
  isOpen, 
  onClose, 
  title = "¡Pedido Confirmado!",
  menuCount,
  totalPrice,
  orderNumber,
  estimatedTime = "15-20 min"
}) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const phoneNumber = '981008142';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="ticket-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ticket-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        {/* Header del ticket */}
        <div className="ticket-header">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h2 className="ticket-title">{title}</h2>
          <div className="ticket-number">#{orderNumber || Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
        </div>

        {/* Línea perforada */}
        <div className="ticket-perforation"></div>

        {/* Contenido del ticket */}
        <div className="ticket-content">
          <div className="ticket-section">
            <div className="ticket-row">
              <Receipt size={16} />
              <span className="label">Menús ordenados:</span>
              <span className="value">{menuCount}</span>
            </div>
            
            <div className="ticket-row">
              <Calendar size={16} />
              <span className="label">Fecha:</span>
              <span className="value">{currentDate}</span>
            </div>
            
            <div className="ticket-row">
              <Clock size={16} />
              <span className="label">Hora:</span>
              <span className="value">{currentTime}</span>
            </div>
          </div>

          {/* Línea separadora */}
          <div className="ticket-divider"></div>

          {/* Total */}
          <div className="ticket-total">
            <div className="total-row">
              <span className="total-label">TOTAL A PAGAR</span>
              <span className="total-amount">S/ {totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          {/* Sección de pago con QR */}
          <div className="ticket-divider"></div>
          <div className="payment-section">
            <div className="payment-header">
              <Smartphone size={16} />
              <span className="payment-title">Pagar con QR</span>
            </div>
            <div className="qr-container">
              <div className="qr-wrapper">
                <img 
                  src="/img/IMG_0366.JPG" 
                  alt="Código QR para pago" 
                  className="qr-code"
                />
              </div>
              <div className="phone-container">
                <div className="phone-number">{phoneNumber}</div>
                <button 
                  className={`copy-button ${copied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                  title="Copiar número"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <p className="thank-you">¡Gracias por tu pedido!</p>
          </div>
        </div>

        {/* Botón de cerrar */}
        <button className="ticket-ok-button" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default TicketModal;