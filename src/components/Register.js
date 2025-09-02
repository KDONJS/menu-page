import React, { useState } from 'react';
import { User, Phone, CheckCircle, Loader, ArrowRight, LogIn } from 'lucide-react';
import authService from '../service/AuthService';
import './Register.css';

const Register = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('register'); // 'register' o 'login'
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });
  const [loginData, setLoginData] = useState({
    phoneNumber: ''
  });
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'registering', 'verifying', 'logging-in', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationData, setRegistrationData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'register') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setLoginData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setCurrentStep('form');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Paso 1: Registro
      setCurrentStep('registering');
      const registerResponse = await authService.register(formData.name, formData.phoneNumber);
      setRegistrationData(registerResponse.data);
      
      // Simular delay para mostrar animación
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Paso 2: Verificación automática con el código recibido
      setCurrentStep('verifying');
      await authService.verifyRegistration(
        formData.name, 
        formData.phoneNumber, 
        registerResponse.data.code
      );
      
      // Simular delay para mostrar animación
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Paso 3: Login automático
      setCurrentStep('logging-in');
      const loginResponse = await authService.login(formData.phoneNumber);
      
      // Simular delay para mostrar animación
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (loginResponse.success) {
        setCurrentStep('success');
        // Delay antes de redirigir
        setTimeout(() => {
          onAuthSuccess(loginResponse.user);
        }, 2000);
      }

    } catch (err) {
      setError(err.message || 'Error en el proceso de registro');
      setCurrentStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const loginResponse = await authService.login(loginData.phoneNumber);
      
      if (loginResponse.success) {
        setSuccess('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          onAuthSuccess(loginResponse.user);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tu número de teléfono.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'registering':
        return (
          <div className="step-content">
            <Loader className="step-icon spinning" size={48} />
            <h3>Registrando usuario...</h3>
            <p>Creando tu cuenta en el sistema</p>
          </div>
        );
      
      case 'verifying':
        return (
          <div className="step-content">
            <CheckCircle className="step-icon pulse" size={48} />
            <h3>Verificando código...</h3>
            <p>Código: {registrationData?.code}</p>
            <p>Validando automáticamente</p>
          </div>
        );
      
      case 'logging-in':
        return (
          <div className="step-content">
            <ArrowRight className="step-icon slide" size={48} />
            <h3>Iniciando sesión...</h3>
            <p>Accediendo a tu cuenta</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="step-content success">
            <CheckCircle className="step-icon bounce" size={48} />
            <h3>¡Registro exitoso!</h3>
            <p>Bienvenido a La Sazón de Lucqa</p>
          </div>
        );
      
      default:
        return (
          <>
            {activeTab === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={20} />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <Phone size={20} />
                    Número de teléfono
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+51915024829"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="register-button"
                  disabled={loading || !formData.name || !formData.phoneNumber}
                >
                  {loading ? (
                    <>
                      <Loader className="spinning" size={20} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <User size={20} />
                      Crear cuenta nueva
                    </>
                  )}
                </button>

                <div className="help-text">
                  <h4>¿Cómo funciona el registro?</h4>
                  <p>1. Ingresa tu nombre y teléfono<br/>
                     2. El sistema te registrará automáticamente<br/>
                     3. Podrás acceder al menú inmediatamente</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="loginPhone">
                    <Phone size={20} />
                    Número de teléfono
                  </label>
                  <input
                    type="tel"
                    id="loginPhone"
                    name="phoneNumber"
                    value={loginData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+51915024829"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading || !loginData.phoneNumber}
                >
                  {loading ? (
                    <>
                      <Loader className="spinning" size={20} />
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Ingresar al sistema
                    </>
                  )}
                </button>

                <div className="help-text">
                  <h4>¿Ya tienes una cuenta?</h4>
                  <p>Solo ingresa tu número de teléfono para acceder al menú del día</p>
                </div>
              </form>
            )}
          </>
        );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>La Sazón de Lucqa</h1>
          <p>Accede para ver nuestro delicioso menú</p>
        </div>
        
        {currentStep === 'form' && (
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
            >
              Crear cuenta
            </button>
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Ya tengo cuenta
            </button>
          </div>
        )}
        
        <div className="register-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          
          {renderStepContent()}
        </div>
        
        {currentStep !== 'form' && (
          <div className="progress-bar">
            <div className={`progress-step ${currentStep === 'registering' || currentStep === 'verifying' || currentStep === 'logging-in' || currentStep === 'success' ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep === 'verifying' || currentStep === 'logging-in' || currentStep === 'success' ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep === 'logging-in' || currentStep === 'success' ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep === 'success' ? 'active' : ''}`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;