import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import ResumenTickets from './ResumenTickets';
import TicketsRecientes from './TicketsRecientes';
import FormularioTicket from './FormularioTicket';
import DashboardReportes from './DashboardReportes';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import UsuariosAdmin from './UsuariosAdmin';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const datosEjemplo = [
  { fecha: '2025-06-17', sede: 'Surquillo', categoria: 'Soporte', usuario: 'Juan', asunto: 'No enciende PC', agente: 'Jerry Contreras', prioridad: 'Alta', descripcion: 'La computadora no enciende.' },
  { fecha: '2025-06-16', sede: 'Chorrillos', categoria: 'Red', usuario: 'Ana', asunto: 'Sin internet', agente: 'Jesús Murrugarra', prioridad: 'Media', descripcion: 'No hay conexión a internet.' },
];

const MenuPrincipal = ({ seccion, setSeccion, permisos, usuarioLogueado }) => {
  const [tickets, setTickets] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [toast, setToast] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalAyudaEditar, setModalAyudaEditar] = useState(false);
  const [esperandoSeleccion, setEsperandoSeleccion] = useState(false);
  const [modalAyudaEliminar, setModalAyudaEliminar] = useState(false);
  const [esperandoSeleccionEliminar, setEsperandoSeleccionEliminar] = useState(false);
  const [ultimoEditadoId, setUltimoEditadoId] = useState(null);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelError, setExcelError] = useState('');
  const ticketsRecientesRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  useEffect(() => {
    if (!editando) {
      fetch('http://localhost:3001/api/tickets/next-id')
        .then(res => res.json())
        .then(data => setNextId(data.next_id || 1));
    }
  }, [seccion, editando, tickets]);

  const actualizarTickets = () => {
    fetch('http://localhost:3001/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  };

  // Datos de ejemplo para las tarjetas
  const total = tickets.length;
  const altas = tickets.filter(t => t.prioridad === 'Alta').length;
  const medias = tickets.filter(t => t.prioridad === 'Media').length;
  const bajas = tickets.filter(t => t.prioridad === 'Baja').length;

  const handleRegistrar = (nuevo) => {
    // Asegurar que el estado siempre esté en minúsculas y por defecto 'abierto'
    const estadoSeguro = (nuevo.estado || 'abierto').toLowerCase();
    const ticketSeguro = { ...nuevo, estado: estadoSeguro };
    if (editando) {
      fetch(`http://localhost:3001/api/tickets/${editando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketSeguro)
      })
        .then(() => {
          setUltimoEditadoId(editando.id);
          actualizarTickets();
          setEditando(null);
          setSeccion('base');
        });
    } else {
      fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketSeguro)
      })
        .then(() => {
          actualizarTickets();
          setSeccion('base');
        });
    }
  };

  const handleEditar = (ticket) => {
    setEditando(ticket);
    setSeccion('tickets');
  };

  const handleEliminar = (ticket) => {
      fetch(`http://localhost:3001/api/tickets/${ticket.id}`, {
        method: 'DELETE'
      })
        .then(() => actualizarTickets());
  };

  // Editar desde botón superior
  const handleEditarSuperior = () => {
    setModalAyudaEditar(true);
    setTicketSeleccionado(null);
    setEsperandoSeleccion(false);
  };

  // Cuando cierra el modal de ayuda, activa la selección
  const cerrarModalAyudaEditar = () => {
    setModalAyudaEditar(false);
    setEsperandoSeleccion(true);
  };

  // Cuando selecciona la fila, edita y desactiva selección
  const handleSeleccionarEditar = (ticket) => {
    if (esperandoSeleccion) {
      setTicketSeleccionado(ticket);
      setEsperandoSeleccion(false);
      handleEditar(ticket);
    }
  };

  // Eliminar desde botón superior
  const handleEliminarSuperior = () => {
    setModalAyudaEliminar(true);
    setTicketSeleccionado(null);
    setEsperandoSeleccionEliminar(false);
  };

  // Cuando cierra el modal de ayuda de eliminar, activa la selección
  const cerrarModalAyudaEliminar = () => {
    setModalAyudaEliminar(false);
    setEsperandoSeleccionEliminar(true);
  };

  // Cuando selecciona la fila, muestra el modal de confirmación
  const handleSeleccionarEliminar = (ticket) => {
    if (esperandoSeleccionEliminar) {
      setTicketSeleccionado(ticket);
      setEsperandoSeleccionEliminar(false);
      setModalEliminar(true);
    }
  };

  // Confirmar eliminación
  const confirmarEliminar = () => {
    handleEliminar(ticketSeleccionado);
    setModalEliminar(false);
    setTicketSeleccionado(null);
  };

  if (seccion === 'dashboard') return <DashboardReportes />;
  if (seccion === 'tickets')
  return (
        <div
          className="flex items-center justify-center min-h-[80vh]"
          style={{
            backgroundImage: "url('/tickets.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        >
        <FormularioTicket 
          contador={editando && editando.id ? editando.id : nextId}
          onRegistrar={handleRegistrar}
          usuarioLogueado={usuarioLogueado}
          {...(editando ? { ...editando } : {})} 
        />
        </div>
    );
  if (seccion === 'base') {
    return (
      <div
        className="flex items-start justify-center min-h-screen relative"
      >
        {/* Fondo con desenfoque y overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('/base_datos.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'blur(6px) grayscale(0.12)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(30,40,60,0.10) 0%, rgba(30,40,60,0.18) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          className="mx-auto rounded-3xl shadow-2xl px-4 py-2 border border-green-300 mt-6"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.18)',
            position: 'relative',
            zIndex: 2,
            border: '2.5px solid #16a34a',
            marginTop: '1.5rem',
            width: '1100px',
            maxWidth: '98vw',
          }}
        >
          <div className="flex w-full items-center mb-2" style={{marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0}}>
            {/* Columna izquierda: Botón Excel + div invisible */}
            <div className="flex items-center" style={{minWidth: '180px', justifyContent: 'flex-start'}}>
              <button
                className="focus:outline-none rounded-full border-4 border-green-400 bg-gradient-to-br from-green-200 to-green-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden"
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', padding: 0, margin: 0 }}
                title="Exportar a Excel"
                onClick={() => setShowExcelModal(true)}
              >
                <img src="/excel.png" alt="Exportar a Excel" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </button>
              <div style={{ width: '124px', height: '1px' }} />
            </div>
            {/* Columna central: Título */}
            <h3 className="text-3xl font-extrabold text-green-700 uppercase tracking-widest drop-shadow-lg text-center flex-1" style={{ letterSpacing: '0.15em', textShadow: '1px 2px 8px #b6e7c9', marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, display: 'block' }}>TICKETS REGISTRADOS</h3>
            {/* Columna derecha: Botones de acción */}
            <div className="flex gap-2 items-center" style={{minWidth: '180px', justifyContent: 'flex-end'}}>
              <button
                className="focus:outline-none rounded-full border-4 border-green-400 bg-gradient-to-br from-green-200 to-green-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden"
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', padding: 0, margin: 0 }}
                title="Nuevo Ticket"
                onClick={() => { setEditando(null); setSeccion('tickets'); setTicketSeleccionado(null); }}
              >
                <img src="/Nuevo_ticket.png" alt="Nuevo Ticket" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </button>
              <button
                className="focus:outline-none rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-200 to-blue-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden"
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', padding: 0, margin: 0 }}
                title="Editar Ticket"
                onClick={handleEditarSuperior}
              >
                <img src="/editar.png" alt="Editar" style={{ width: '70%', height: '70%', objectFit: 'contain', display: 'block' }} />
              </button>
              <button
                className="focus:outline-none rounded-full border-4 border-red-400 bg-gradient-to-br from-red-200 to-red-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden"
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', padding: 0, margin: 0 }}
                title="Eliminar Ticket"
                onClick={handleEliminarSuperior}
              >
                <img src="/eliminar.png" alt="Eliminar" style={{ width: '70%', height: '70%', objectFit: 'contain', display: 'block' }} />
              </button>
            </div>
          </div>
          <TicketsRecientes
            ref={ticketsRecientesRef}
            tickets={tickets}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            onActualizar={actualizarTickets}
            onSeleccionar={esperandoSeleccion ? handleSeleccionarEditar : esperandoSeleccionEliminar ? handleSeleccionarEliminar : setTicketSeleccionado}
            ticketSeleccionado={ultimoEditadoId ? tickets.find(t => t.id === ultimoEditadoId) : ticketSeleccionado}
            mostrarAcciones={false}
          />
          {/* MODAL DE EXPORTACIÓN EXCEL */}
          {showExcelModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-green-400 max-w-md w-full text-center relative" style={{backdropFilter:'blur(4px)'}}>
                <h3 className="text-2xl font-extrabold text-green-700 mb-6 tracking-wide uppercase">Exportar tickets a Excel</h3>
                <div className="flex flex-col gap-4 mb-6">
                  {excelError && <div className="text-red-600 font-semibold text-sm mt-2">{excelError}</div>}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <button
                    className="bg-gradient-to-br from-green-700 to-green-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg uppercase tracking-wide text-base transition-all duration-150 hover:scale-105 hover:brightness-110 hover:shadow-2xl active:scale-95 focus:outline-none"
                    onClick={async () => {
                      setExcelError('');
                      try {
                        // Obtener los datos filtrados de TicketsRecientes
                        const ticketsFiltrados = ticketsRecientesRef.current?.getTicketsFiltrados ? ticketsRecientesRef.current.getTicketsFiltrados() : [];
                        
                        const workbook = new ExcelJS.Workbook();
                        const worksheet = workbook.addWorksheet('Tickets');

                        // Insertar el logo en la celda A1, manteniendo proporción (ejemplo: 120x90 px)
                        const response = await fetch('/logo.png');
                        const imageBuffer = await response.arrayBuffer();
                        const imageId = workbook.addImage({
                          buffer: imageBuffer,
                          extension: 'png',
                        });
                        worksheet.addImage(imageId, {
                          tl: { col: 0, row: 0 },
                          ext: { width: 120, height: 90 }, // Proporción original
                        });
                        worksheet.getRow(1).height = 70;
                        worksheet.getRow(2).height = 30;
                        worksheet.getRow(3).height = 10;
                        worksheet.getRow(4).height = 10;

                        // Fusionar A2:K2 para el título y centrarlo
                        worksheet.mergeCells('A2:K2');
                        worksheet.getCell('A2').value = 'REPORTE DE TICKETS';
                        worksheet.getCell('A2').font = { size: 20, bold: true };
                        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

                        // Encabezado de la tabla en la fila 5, columna A
                        const encabezados = ['N°', 'FECHA', 'HORA', 'SEDE', 'CATEGORÍA', 'USUARIO', 'ASUNTO', 'AGENTE', 'PRIORIDAD', 'ESTADO', 'DESCRIPCIÓN'];
                        worksheet.getRow(5).values = encabezados;

                        // Estilo para el encabezado (fondo verde y bordes negros)
                        const headerRow = worksheet.getRow(5);
                        headerRow.eachCell((cell) => {
                          cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FF16A34A' } // Verde
                          };
                          cell.font = {
                            bold: true,
                            color: { argb: 'FFFFFFFF' } // Blanco
                          };
                          cell.alignment = { horizontal: 'center', vertical: 'middle' };
                          cell.border = {
                            top: { style: 'thin', color: { argb: 'FF000000' } },
                            left: { style: 'thin', color: { argb: 'FF000000' } },
                            bottom: { style: 'thin', color: { argb: 'FF000000' } },
                            right: { style: 'thin', color: { argb: 'FF000000' } },
                          };
                        });

                        // Ancho de columnas
                        const widths = [8, 15, 12, 15, 15, 20, 25, 20, 12, 12, 50];
                        widths.forEach((w, i) => worksheet.getColumn(i + 1).width = w); // Desde la columna A

                        // Agregar los datos filtrados a partir de la fila 6
                        ticketsFiltrados.forEach((ticket, idx) => {
                          worksheet.getRow(6 + idx).values = [
                            ticket.id,
                            ticket.fecha ? ticket.fecha : '',
                            ticket.hora ? ticket.hora : '',
                            ticket.sede || '',
                            ticket.categoria || '',
                            ticket.usuario ? ticket.usuario.toUpperCase() : '',
                            ticket.asunto || '',
                            ticket.agente ? ticket.agente.toUpperCase() : '',
                            ticket.prioridad || '',
                            ticket.estado || 'abierto',
                            ticket.descripcion || ''
                          ];
                        });

                        // Aplicar estilos a las filas de datos (bordes negros y wrapText en descripción)
                        for (let i = 6; i < 6 + ticketsFiltrados.length; i++) {
                          const row = worksheet.getRow(i);
                          row.eachCell((cell, colNumber) => {
                            cell.alignment = { horizontal: 'center', vertical: 'middle' };
                            cell.border = {
                              top: { style: 'thin', color: { argb: 'FF000000' } },
                              left: { style: 'thin', color: { argb: 'FF000000' } },
                              bottom: { style: 'thin', color: { argb: 'FF000000' } },
                              right: { style: 'thin', color: { argb: 'FF000000' } },
                            };
                            if (colNumber === 11) { // Columna descripción
                              cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
                            }
                          });
                        }

                        // Generar el archivo
                        const buffer = await workbook.xlsx.writeBuffer();
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        
                        // Nombre del archivo con fecha
                        const fechaActual = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: es });
                        saveAs(blob, `Tickets_Filtrados_${fechaActual}.xlsx`);
                        setShowExcelModal(false);
                        setExcelError('');
                      } catch (error) {
                        setExcelError('Error al generar el archivo.');
                      }
                    }}
                  >
                    Exportar
                  </button>
                  <button
                    className="px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-gray-700 border-2 border-gray-400 bg-white shadow-md transition-all duration-150 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-700 hover:shadow-lg active:scale-95 focus:outline-none text-base"
                    onClick={() => { setShowExcelModal(false); setExcelError(''); }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Modal de ayuda para editar */}
          {modalAyudaEditar && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-400 max-w-md w-full text-center">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">Editar ticket</h3>
                <p className="mb-6 text-gray-700">Selecciona con <span className="font-bold">doble clic</span> la fila del ticket que deseas editar.</p>
                <div className="flex justify-center mt-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={cerrarModalAyudaEditar}>Entendido</button>
                </div>
              </div>
            </div>
          )}
          {/* Modal de ayuda para eliminar */}
          {modalAyudaEliminar && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-400 max-w-md w-full text-center">
                <h3 className="text-2xl font-bold text-red-700 mb-4">Eliminar ticket</h3>
                <p className="mb-6 text-gray-700">Selecciona con <span className="font-bold">doble clic</span> la fila del ticket que deseas eliminar.</p>
                <div className="flex justify-center mt-4">
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition" onClick={cerrarModalAyudaEliminar}>Entendido</button>
                </div>
              </div>
            </div>
          )}
          {/* Modal de confirmación de eliminación */}
          {modalEliminar && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-400 max-w-md w-full text-center">
                <h3 className="text-2xl font-bold text-red-700 mb-4">¿Eliminar ticket?</h3>
                <p className="mb-6 text-gray-700">¿Estás seguro de que deseas eliminar el ticket <span className="font-bold">N° {ticketSeleccionado?.id}</span>?<br/>Esta acción no se puede deshacer.</p>
                <div className="flex justify-center gap-6 mt-4">
                  <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onClick={() => setModalEliminar(false)}>Cancelar</button>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition" onClick={confirmarEliminar}>Eliminar</button>
                </div>
          </div>
        </div>
      )}
        </div>
    </div>
  );
  }
  if (seccion === 'usuarios') return <UsuariosAdmin usuarioLogueado={usuarioLogueado} />;
  return null;
};

export default MenuPrincipal; 