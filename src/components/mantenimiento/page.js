import React from 'react';
import { ShoppingBag, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import './page.css';

const MaintenancePage = () => {
  const whatsappLink = 'https://wa.me/51904397748';
  const phoneNumber = '904 397 748';

  return (
    <div className="mnt-container">
      <div className="mnt-card">
        <div className="mnt-header">
          <div className="mnt-icon">
            <ShoppingBag size={64} />
          </div>
          <h1 className="mnt-title">Venta de Menús</h1>
          <p className="mnt-subtitle">Estamos renovando nuestro sitio</p>
        </div>

        <div className="mnt-info">
          <div className="mnt-row">
            <Clock size={20} />
            <span>La página estará disponible lo antes posible.</span>
          </div>
          <div className="mnt-row">
            <ShieldCheck size={20} />
            <span>Gracias por su preferencia.</span>
          </div>
        </div>

        <div className="mnt-contact">
          <div className="mnt-contact-label">
            <Phone size={18} />
            <span>Comunícate por WhatsApp</span>
          </div>
          <a
            className="mnt-contact-button"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`Contactar por WhatsApp al ${phoneNumber}`}
          >
            <MessageCircle size={16} />
            <span>{phoneNumber}</span>
          </a>
        </div>

        <div className="mnt-footer">
          <div className="mnt-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;