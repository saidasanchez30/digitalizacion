import React, { useMemo, useState } from 'react';
import { getVaultDocuments, postVaultDocument } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/formatters';

function Vault() {
  const [orderId, setOrderId] = useState('');
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    document_type: '',
    category: '',
    department: '',
    confidentiality_level: '',
  });

  const [formData, setFormData] = useState({
    file_name: 'Contrato_Servicios_2026.pdf',
    document_type: 'Contrato',
    category: 'Legal',
    department: 'Jurídico',
    description: 'Contrato de prestación de servicios firmado con proveedor externo.',
    keywords: 'contrato, proveedor, servicios, 2026, legal',
    document_date: '2026-05-20',
    confidentiality_level: 'Confidencial',
    retention_years: 5,
    security_status: 'encrypted',
    ocr_status: 'ocr',
    storage_url: 'https://demo-storage.com/legal/contrato_servicios_2026.pdf',
  });

  const documentTypes = [
    'Contrato',
    'Factura',
    'Expediente',
    'Comprobante',
    'Acta',
    'Identificación',
    'Reporte',
    'Oficio',
    'Documento fiscal',
    'Documento legal',
    'Documento administrativo',
  ];

  const categories = [
    'Legal',
    'Fiscal',
    'Recursos Humanos',
    'Contabilidad',
    'Administración',
    'Operaciones',
    'Clientes',
    'Proveedores',
    'Auditoría',
  ];

  const departments = [
    'Jurídico',
    'Contabilidad',
    'Recursos Humanos',
    'Administración',
    'Dirección',
    'Operaciones',
    'Ventas',
    'Compras',
    'Archivo',
  ];

  const confidentialityLevels = [
    'Pública',
    'Interna',
    'Confidencial',
    'Altamente confidencial',
  ];

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Por favor ingresa un ID de orden');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getVaultDocuments(parseInt(orderId, 10));
      setDocuments(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'No se pudieron cargar los documentos de la bóveda. Asegúrate de que la orden pertenezca al Plan Premium.'
      );
      setDocuments(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'retention_years'
        ? value === '' ? '' : parseInt(value, 10)
        : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Primero ingresa y consulta un ID de orden Premium');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await postVaultDocument(parseInt(orderId, 10), formData);

      const data = await getVaultDocuments(parseInt(orderId, 10));
      setDocuments(data);
    } catch (err) {
      setError('Error al agregar documento: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];

    return documents.filter((doc) => {
      const searchText = filters.search.toLowerCase();

      const matchesSearch =
        !searchText ||
        doc.file_name?.toLowerCase().includes(searchText) ||
        doc.description?.toLowerCase().includes(searchText) ||
        doc.keywords?.toLowerCase().includes(searchText) ||
        doc.document_type?.toLowerCase().includes(searchText) ||
        doc.category?.toLowerCase().includes(searchText) ||
        doc.department?.toLowerCase().includes(searchText);

      const matchesType =
        !filters.document_type || doc.document_type === filters.document_type;

      const matchesCategory =
        !filters.category || doc.category === filters.category;

      const matchesDepartment =
        !filters.department || doc.department === filters.department;

      const matchesConfidentiality =
        !filters.confidentiality_level ||
        doc.confidentiality_level === filters.confidentiality_level;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesDepartment &&
        matchesConfidentiality
      );
    });
  }, [documents, filters]);

  return (
    <div className="vault-page">
      <div className="vault-hero">
        <h1>Bóveda Digital y Gestión Documental</h1>
        <p>
          Consulta, clasifica y administra documentos digitalizados del Plan Premium
          mediante metadatos como tipo documental, categoría, área responsable,
          palabras clave, fecha del documento y nivel de confidencialidad.
        </p>
      </div>

      <form onSubmit={handleSearch} className="vault-search-card">
        <div className="vault-search-field">
          <label>ID de orden Premium</label>
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Ej: 5"
            min="1"
          />
        </div>

        <button type="submit" className="vault-primary-btn">
          Ver bóveda
        </button>
      </form>

      {error && !loading && <ErrorMessage title="Error" message={error} />}
      {loading && <Loading message="Cargando documentos..." />}

      {documents && (
        <div className="vault-content">
          <section className="vault-card">
            <div className="vault-section-header">
              <h3>Filtros de gestión documental</h3>
              <p>Encuentra documentos por nombre, tipo, categoría, departamento o confidencialidad.</p>
            </div>

            <div className="vault-filters-grid">
              <div className="vault-field">
                <label>Buscar</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Buscar por nombre, descripción o palabras clave"
                />
              </div>

              <div className="vault-field">
                <label>Tipo documental</label>
                <select
                  name="document_type"
                  value={filters.document_type}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Categoría</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Área / Departamento</label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Nivel de confidencialidad</label>
                <select
                  name="confidentiality_level"
                  value={filters.confidentiality_level}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  {confidentialityLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="vault-filter-actions">
                <button
                  type="button"
                  className="vault-outline-btn"
                  onClick={() =>
                    setFilters({
                      search: '',
                      document_type: '',
                      category: '',
                      department: '',
                      confidentiality_level: '',
                    })
                  }
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </section>

          <section className="vault-card">
            <div className="vault-section-header">
              <h3>
                Documentos encontrados ({filteredDocuments.length} de {documents.length})
              </h3>
              <p>Visualiza cada documento con sus metadatos de gestión documental.</p>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="vault-empty-state">
                <h4>Sin resultados</h4>
                <p>No hay documentos que coincidan con los filtros seleccionados.</p>
              </div>
            ) : (
              <div className="vault-documents-grid">
                {filteredDocuments.map((doc) => (
                  <article key={doc.id} className="vault-document-card">
                    <div className="vault-document-top">
                      <div>
                        <h4>{doc.file_name}</h4>
                        <p>{doc.description || 'Sin descripción disponible.'}</p>
                      </div>

                      <a
                        href={doc.storage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vault-secondary-btn"
                      >
                        Descargar
                      </a>
                    </div>

                    <div className="vault-tags">
                      <span className="vault-tag">{doc.document_type || 'Sin tipo'}</span>
                      <span className="vault-tag">{doc.category || 'Sin categoría'}</span>
                      <span className="vault-tag">{doc.department || 'Sin área'}</span>
                    </div>

                    <div className="vault-metadata-grid">
                      <div>
                        <span>Confidencialidad</span>
                        <strong>{doc.confidentiality_level || 'Sin definir'}</strong>
                      </div>
                      <div>
                        <span>Fecha del documento</span>
                        <strong>{doc.document_date ? formatDate(doc.document_date) : '-'}</strong>
                      </div>
                      <div>
                        <span>Años de conservación</span>
                        <strong>{doc.retention_years ? `${doc.retention_years} años` : '-'}</strong>
                      </div>
                      <div>
                        <span>OCR</span>
                        <strong>{doc.ocr_status}</strong>
                      </div>
                      <div>
                        <span>Seguridad</span>
                        <strong>{doc.security_status}</strong>
                      </div>
                    </div>

                    {doc.keywords && (
                      <div className="vault-keywords">
                        <span>Palabras clave:</span>
                        <p>{doc.keywords}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="vault-card">
            <div className="vault-section-header">
              <h3>Agregar documento clasificado</h3>
            </div>

            <form onSubmit={handleAddDocument} className="vault-form-grid">
              <div className="vault-field">
                <label>Nombre de archivo</label>
                <input
                  type="text"
                  name="file_name"
                  value={formData.file_name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="vault-field">
                <label>Tipo documental</label>
                <select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleFormChange}
                  required
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Área / Departamento</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                >
                  <option value="">Sin definir</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Fecha del documento</label>
                <input
                  type="date"
                  name="document_date"
                  value={formData.document_date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="vault-field">
                <label>Nivel de confidencialidad</label>
                <select
                  name="confidentiality_level"
                  value={formData.confidentiality_level}
                  onChange={handleFormChange}
                >
                  <option value="">Sin definir</option>
                  {confidentialityLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="vault-field">
                <label>Años de conservación</label>
                <input
                  type="number"
                  name="retention_years"
                  value={formData.retention_years}
                  onChange={handleFormChange}
                  min="1"
                />
              </div>

              <div className="vault-field">
                <label>URL de almacenamiento</label>
                <input
                  type="url"
                  name="storage_url"
                  value={formData.storage_url}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="vault-field vault-field-full">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>

              <div className="vault-field vault-field-full">
                <label>Palabras clave</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleFormChange}
                  placeholder="Ej: contrato, proveedor, servicios, 2026"
                />
              </div>

              <div className="vault-field">
                <label>Estado de seguridad</label>
                <select
                  name="security_status"
                  value={formData.security_status}
                  onChange={handleFormChange}
                >
                  <option value="encrypted_simulated">Cifrado</option>
                  <option value="access_control_simulated">Control de acceso</option>
                  <option value="pending_security_review">Pendiente de revisión</option>
                </select>
              </div>

              <div className="vault-field">
                <label>Estado OCR</label>
                <select
                  name="ocr_status"
                  value={formData.ocr_status}
                  onChange={handleFormChange}
                >
                  <option value="ocr_simulated">OCR</option>
                  <option value="not_applied">No aplicado</option>
                  <option value="pending_ocr">Pendiente OCR</option>
                </select>
              </div>

              <div className="vault-form-actions vault-field-full">
                <button
                  type="submit"
                  className="vault-primary-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Agregando...' : 'Agregar documento a la bóveda'}
                </button>

                <button
                  type="button"
                  className="vault-outline-btn"
                  onClick={() => {
                    setDocuments(null);
                    setOrderId('');
                    setError(null);
                    setFilters({
                      search: '',
                      document_type: '',
                      category: '',
                      department: '',
                      confidentiality_level: '',
                    });
                  }}
                >
                  Buscar otra orden
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Vault;