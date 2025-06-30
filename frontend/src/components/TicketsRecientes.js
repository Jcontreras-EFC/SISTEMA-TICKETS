import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { parseISO, isAfter, isBefore, isEqual, format } from 'date-fns';
import { es } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const estados = ['abierto', 'pendiente', 'cerrado'];

const TicketsRecientes = forwardRef(({ tickets, onEditar, onEliminar, onActualizar, onSeleccionar, ticketSeleccionado, mostrarAcciones = true, onShowExcelModal, onEditarSuperior, onEliminarSuperior }, ref) => {
  const [ticketsLocal, setTicketsLocal] = React.useState(tickets);
  const [filtroUsuario, setFiltroUsuario] = React.useState('');
  const [filtroAgente, setFiltroAgente] = React.useState('');
  const [filtroSede, setFiltroSede] = React.useState('');
  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [editandoEstadoId, setEditandoEstadoId] = React.useState(null);
  const selectEstadoRefs = useRef({});

  // Obtener lista única de agentes y sedes presentes en los tickets
  const agentesUnicos = Array.from(new Set(tickets.map(t => t.agente).filter(Boolean)));
  const sedesUnicas = Array.from(new Set(tickets.map(t => t.sede).filter(Boolean)));

  React.useEffect(() => {
    setTicketsLocal(tickets);
  }, [tickets]);

  React.useEffect(() => {
    let filtrados = tickets;
    if (fechaInicio && fechaFin) {
      filtrados = filtrados.filter(t => {
        const fecha = t.fecha ? parseISO(t.fecha) : null;
        return (
          fecha &&
          (isEqual(fecha, parseISO(fechaInicio)) || isAfter(fecha, parseISO(fechaInicio))) &&
          (isEqual(fecha, parseISO(fechaFin)) || isBefore(fecha, parseISO(fechaFin)))
        );
      });
    }
    if (filtroUsuario) {
      filtrados = filtrados.filter(t => (t.usuario || '').toLowerCase().includes(filtroUsuario.toLowerCase()));
    }
    if (filtroAgente) {
      filtrados = filtrados.filter(t => (t.agente || '').toLowerCase().includes(filtroAgente.toLowerCase()));
    }
    if (filtroSede) {
      filtrados = filtrados.filter(t => (t.sede || '').toLowerCase() === filtroSede.toLowerCase());
    }
    setTicketsLocal(filtrados);
  }, [fechaInicio, fechaFin, filtroUsuario, filtroAgente, filtroSede, tickets]);

  useEffect(() => {
    if (editandoEstadoId && selectEstadoRefs.current[editandoEstadoId]) {
      const selectEl = selectEstadoRefs.current[editandoEstadoId];
      selectEl.focus();
      if (selectEl.showPicker) {
        selectEl.showPicker();
      } else {
        selectEl.click();
      }
    }
  }, [editandoEstadoId]);

  const handleEstadoChange = (id, nuevoEstado) => {
    // Actualización optimista: cambiamos el estado localmente primero
    setTicketsLocal(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    // Luego actualizamos en el backend
    fetch(`http://192.168.12.66:3001/api/tickets`)
      .then(res => res.json())
      .then(tickets => {
        const ticket = tickets.find(t => t.id === id);
        if (!ticket) return;
        fetch(`http://192.168.12.66:3001/api/tickets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ticket, estado: nuevoEstado })
        }).then(() => {
          if (typeof onActualizar === 'function') onActualizar();
        });
      });

    // Función para exportar tickets filtrados a Excel
    const exportarExcel = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tickets');

        // Definir las columnas
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 8 },
          { header: 'FECHA', key: 'fecha', width: 15 },
          { header: 'USUARIO', key: 'usuario', width: 20 },
          { header: 'AGENTE', key: 'agente', width: 20 },
          { header: 'SEDE', key: 'sede', width: 15 },
          { header: 'ESTADO', key: 'estado', width: 12 },
          { header: 'DESCRIPCIÓN', key: 'descripcion', width: 50 }
        ];

        // Estilo para el encabezado (fondo verde)
        const headerRow = worksheet.getRow(1);
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
        });

        // Agregar los datos filtrados
        ticketsLocal.forEach(ticket => {
          worksheet.addRow({
            id: ticket.id,
            fecha: ticket.fecha ? format(parseISO(ticket.fecha), 'dd/MM/yyyy', { locale: es }) : '',
            usuario: ticket.usuario ? ticket.usuario.toUpperCase() : '',
            agente: ticket.agente ? ticket.agente.toUpperCase() : '',
            sede: ticket.sede || '',
            estado: ticket.estado || 'abierto',
            descripcion: ticket.descripcion || ''
          });
        });

        // Aplicar estilos a las filas de datos
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          row.eachCell((cell, colNumber) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            if (colNumber === 7) { // Columna descripción
              cell.alignment = { horizontal: 'left', vertical: 'middle' };
            }
          });
        }

        // Generar el archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Nombre del archivo con fecha
        const fechaActual = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: es });
        saveAs(blob, `Tickets_Filtrados_${fechaActual}.xlsx`);

      } catch (error) {
        console.error('Error al exportar a Excel:', error);
        alert('Error al exportar el archivo Excel');
      }
    };
  };

  // Exponer los datos filtrados al componente padre
  useImperativeHandle(ref, () => ({
    getTicketsFiltrados: () => ticketsLocal
  }));

  // Función para asignar clase de fondo y borde según el estado (máxima diferenciación visual)
  const getEstadoClass = (estado) => {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-400 border-l-4 border-yellow-600';
      case 'abierto':
        return 'bg-emerald-200 border-l-4 border-emerald-500';
      case 'cerrado':
        return 'bg-gray-400 border-l-4 border-gray-600';
      default:
        return '';
    }
  };

  // Función para asignar clase de fondo SOLO a la celda del estado (colores corporativos notorios)
  const getEstadoCellClass = (estado) => {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-300 font-bold'; // Amarillo intenso
      case 'abierto':
        return 'bg-green-300 font-bold'; // Verde fuerte
      case 'cerrado':
        return 'bg-slate-400 font-bold'; // Gris oscuro
      default:
        return '';
    }
  };

  // Manejar doble clic en fila para seleccionar
  const handleRowDoubleClick = (ticket) => {
    if (onSeleccionar) onSeleccionar(ticket);
  };

  return (
    <div className="mx-auto px-0 flex flex-col justify-start items-center" style={{width: '96vw', minHeight: '300px'}}>
      <div className="w-full bg-white rounded-2xl shadow-lg border border-green-200 p-6 flex flex-col justify-start items-center" style={{minHeight: '120px', background: '#fff', zIndex: 10, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
        <div className="relative flex items-center w-full mb-4" style={{minHeight: '56px'}}>
          {/* Botón Excel a la izquierda */}
          {mostrarAcciones && (
            <button className="focus:outline-none rounded-full border-4 border-green-400 bg-gradient-to-br from-green-200 to-green-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden absolute left-0" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', padding: 0, margin: 0, top: '50%', transform: 'translateY(-50%)' }} title="Exportar a Excel" onClick={onShowExcelModal}><img src="/excel.png" alt="Exportar a Excel" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /></button>
          )}
          {/* Título perfectamente centrado */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 uppercase tracking-widest drop-shadow-lg mb-0 mx-auto" style={{letterSpacing:'0.08em', background:'none', border:'none', boxShadow:'none', padding:'0.5rem 0 0.5rem 0', textAlign:'center', width:'100%'}}>TICKETS REGISTRADOS</h2>
          {/* Botones de acción al extremo derecho */}
          {mostrarAcciones && (
            <div className="flex flex-row gap-2 absolute right-0" style={{top: '50%', transform: 'translateY(-50%)'}}>
              <button className="focus:outline-none rounded-full border-4 border-green-400 bg-gradient-to-br from-green-200 to-green-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', padding: 0, margin: 0 }} title="Nuevo Ticket" onClick={onEditarSuperior}><img src="/Nuevo_ticket.png" alt="Nuevo Ticket" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /></button>
              <button className="focus:outline-none rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-200 to-blue-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', padding: 0, margin: 0 }} title="Editar Ticket" onClick={onEditarSuperior}><img src="/editar.png" alt="Editar" style={{ width: '70%', height: '70%', objectFit: 'contain', display: 'block' }} /></button>
              <button className="focus:outline-none rounded-full border-4 border-red-400 bg-gradient-to-br from-red-200 to-red-400 shadow-xl transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:brightness-110 flex items-center justify-center overflow-hidden" style={{ width: '46px', height: '46px', minWidth: '46px', minHeight: '46px', padding: 0, margin: 0 }} title="Eliminar Ticket" onClick={onEliminarSuperior}><img src="/eliminar.png" alt="Eliminar" style={{ width: '70%', height: '70%', objectFit: 'contain', display: 'block' }} /></button>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-6xl mx-auto mt-4">
          <div className="flex flex-wrap gap-2 mb-4 items-end">
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>PROYECTO</option>
            </select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>PRIORIDAD</option>
            </select>
            <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" placeholder="INICIO" />
            <input type="date" className="border border-gray-300 rounded px-2 py-1 text-sm" placeholder="FIN" />
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>ESTADO</option>
              <option>Pendiente</option>
              <option>Resuelto</option>
            </select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>TIPO</option>
              <option>Ticket</option>
            </select>
            <button className="bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition">Procesar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Asunto</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Proyecto</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Tipo</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Categoría</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Prioridad</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Estado</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Fecha</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-gray-200">Última Actualización</th>
                </tr>
              </thead>
              <tbody>
                {ticketsLocal.map((t, i) => (
                  <tr key={t.id || i} className="border-b border-gray-200 hover:bg-gray-50" style={{ verticalAlign: 'middle', cursor: 'pointer', transition: 'background 0.2s' }} onDoubleClick={() => handleRowDoubleClick(t)}>
                    <td className="px-2 py-2 text-left align-middle text-sm">{String(t.asunto)}</td>
                    <td className="px-2 py-2 text-left align-middle text-sm">{String(t.proyecto)}</td>
                    <td className="px-2 py-2 text-left align-middle text-sm">{String(t.tipo)}</td>
                    <td className="px-2 py-2 text-left align-middle text-sm">{String(t.categoria)}</td>
                    <td className="px-2 py-2 text-left align-middle text-sm">
                      <span className={
                        t.prioridad === 'alta' ? 'bg-blue-200 text-blue-800 px-2 py-1 rounded font-semibold text-xs' :
                        t.prioridad === 'media' ? 'bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold text-xs' :
                        t.prioridad === 'baja' ? 'bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold text-xs' :
                        'bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold text-xs'
                      }>{t.prioridad ? t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1) : '-'}</span>
                    </td>
                    <td className="px-2 py-2 text-left align-middle text-sm">
                      <span className={
                        t.estado === 'nuevo' ? 'bg-sky-200 text-sky-800 px-2 py-1 rounded font-semibold text-xs' :
                        t.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-semibold text-xs' :
                        t.estado === 'abierto' ? 'bg-green-200 text-green-800 px-2 py-1 rounded font-semibold text-xs' :
                        t.estado === 'cerrado' ? 'bg-gray-300 text-gray-800 px-2 py-1 rounded font-semibold text-xs' :
                        'bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold text-xs'
                      }>{t.estado ? t.estado.charAt(0).toUpperCase() + t.estado.slice(1) : '-'}</span>
                    </td>
                    <td className="px-2 py-2 text-left align-middle text-sm">{String(t.fecha)}</td>
                    <td className="px-2 py-2 text-left align-middle text-sm">
                      {t.ultima_actualizacion
                        ? format(parseISO(t.ultima_actualizacion), 'dd/MM/yyyy', { locale: es })
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TicketsRecientes; 