import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        color: 'white',
        padding: 'var(--space-2xl)',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: 'var(--space-2xl)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>
          Digitalización Documental Empresarial
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2xl)', opacity: 0.9 }}>
          Digitalizamos, organizamos y protegemos la información documental de tu empresa.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/catalog')}
          >
            Ver planes
          </button>
          <button 
            className="btn btn-outline btn-lg"
            onClick={() => navigate('/quotation')}
            style={{ borderColor: 'white', color: 'white' }}
          >
            Cotizar ahora
          </button>
        </div>
      </section>

      {/* Descripción */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          ¿Qué ofrecemos?
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--color-text-light)',
          maxWidth: '600px',
          margin: '0 auto var(--space-2xl)',
        }}>
          Convierte archivos físicos en documentos digitales consultables y seguros. 
          Servicios profesionales de digitalización con múltiples opciones de entrega 
          y seguridad avanzada.
        </p>
      </section>

      {/* Valor Agregado */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          Ventajas de nuestro servicio
        </h2>
        <div className="grid grid-3">
          {[
            { 
              title: '📊 Digitalización masiva', 
              desc: 'Procesamiento de miles de documentos con tecnología de vanguardia.' 
            },
            { 
              title: '🗓️ Recolección programada', 
              desc: 'Recogemos tus documentos en la fecha y hora que mejor te convenga.' 
            },
            { 
              title: '🔒 Bóveda Digital Segura', 
              desc: 'Almacenamiento seguro y acceso en línea a tus documentos digitalizados.' 
            },
            { 
              title: '📦 Entrega documental flexible', 
              desc: 'Múltiples opciones: unidad física, nube o servidor SFTP.' 
            },
            { 
              title: '🤖 OCR', 
              desc: 'Documentos consultables y organizados con tecnología de extracción.' 
            },
            { 
              title: '⚡ Servicio rápido', 
              desc: 'Entrega en 7-10 días según el plan elegido.' 
            },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-light)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          Nuestros Planes
        </h2>
        <div className="grid grid-2">
          <div className="card" style={{ borderTop: '4px solid #1a3a52' }}>
            <h3>Plan Estándar</h3>
            <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-lg)' }}>
              Digitalización y entrega flexible
            </p>
            <ul style={{ 
              listStyle: 'none', 
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}>
              <li>✓ Digitalización profesional</li>
              <li>✓ Múltiples opciones de entrega</li>
              <li>✓ Soporte técnico incluido</li>
              <li>✗ Sin bóveda digital</li>
            </ul>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/quotation')}
              style={{ width: '100%' }}
            >
              Solicitar cotización
            </button>
          </div>

          <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
            <h3>Plan Premium</h3>
            <span className="badge badge-info" style={{ marginBottom: 'var(--space-md)' }}>
              Recomendado
            </span>
            <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-lg)' }}>
              Digitalización con bóveda digital segura
            </p>
            <ul style={{ 
              listStyle: 'none', 
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
            }}>
              <li>✓ Digitalización profesional</li>
              <li>✓ Bóveda digital segura</li>
              <li>✓ Clasificación documental</li>
              <li>✓ Consulta y descarga en línea</li>
            </ul>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/quotation')}
              style={{ width: '100%' }}
            >
              Solicitar cotización
            </button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-2xl)',
        borderRadius: 'var(--border-radius-lg)',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>
          ¿Listo para digitalizar tus documentos?
        </h2>
        <p style={{ 
          color: 'var(--color-text-light)',
          marginBottom: 'var(--space-lg)',
        }}>
          Comienza ahora mismo con una cotización sin compromiso.
        </p>
        <button 
          className="btn btn-secondary btn-lg"
          onClick={() => navigate('/quotation')}
        >
          Generar cotización
        </button>
      </section>
    </div>
  );
}

export default Home;
