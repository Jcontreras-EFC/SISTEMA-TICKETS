import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { parseISO, isAfter, isBefore, isEqual, format } from 'date-fns';
import { es } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const estados = ['abierto', 'pendiente', 'cerrado'];

const TicketsRecientes = forwardRef(({ tickets, onEditar, onEliminar, onActualizar, onSeleccionar, ticketSeleccionado, mostrarAcciones = true }, ref) => {
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
    fetch(`http://localhost:3001/api/tickets`)
      .then(res => res.json())
      .then(tickets => {
        const ticket = tickets.find(t => t.id === id);
        if (!ticket) return;
        fetch(`http://localhost:3001/api/tickets/${id}`, {
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
    <div className="inline-block w-auto mx-auto my-8 rounded-2xl shadow-lg bg-white/60 p-2 md:p-6 border border-green-200"
         style={{backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', boxShadow:'0 2px 16px 0 rgba(22,163,74,0.10)', minWidth: 'min-content', maxWidth: '100vw'}}>
      {/* Barra de búsqueda profesional */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-3 px-1">
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
          {/* Filtro por fecha */}
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="px-2 py-1 rounded-md border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-200 bg-white/70 text-green-900 font-medium placeholder-gray-400 transition w-32 shadow-sm text-sm"
            placeholder="Fecha inicio"
            style={{minWidth: 110}}
          />
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="px-2 py-1 rounded-md border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-200 bg-white/70 text-green-900 font-medium placeholder-gray-400 transition w-32 shadow-sm text-sm"
            placeholder="Fecha fin"
            style={{minWidth: 110}}
          />
          {/* Filtro por sede */}
          <select
            value={filtroSede}
            onChange={e => setFiltroSede(e.target.value)}
            className="px-2 py-1 rounded-md border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-200 bg-white/70 text-green-900 font-medium transition w-36 shadow-sm text-sm"
            style={{minWidth: 110}}
          >
            <option value="">Sede (todas)</option>
            {sedesUnicas.map(sede => (
              <option key={sede} value={sede}>{sede}</option>
            ))}
          </select>
          {/* Filtro por usuario y agente (se mantienen) */}
          <input
            type="text"
            placeholder="Usuario"
            value={filtroUsuario}
            onChange={e => setFiltroUsuario(e.target.value)}
            className="px-2 py-1 rounded-md border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-200 bg-white/70 text-green-900 font-medium placeholder-gray-400 transition w-36 shadow-sm text-sm"
            style={{minWidth: 110}}
          />
          <select
            value={filtroAgente}
            onChange={e => setFiltroAgente(e.target.value)}
            className="px-2 py-1 rounded-md border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-200 bg-white/70 text-green-900 font-medium transition w-36 shadow-sm text-sm"
            style={{minWidth: 110}}
          >
            <option value="">Agente (todos)</option>
            {agentesUnicos.map(agente => (
              <option key={agente} value={agente}>{agente}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full" style={{maxWidth: '1000px', minWidth: '1000px', margin: '0 auto'}}>
        <table className="w-full rounded-xl bg-white/70" style={{width: '1000px', maxWidth: '1000px', minWidth: '1000px', tableLayout:'auto', backdropFilter:'blur(2px)', fontFamily: 'Segoe UI, Roboto, Arial, sans-serif'}}>
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>N°</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Fecha</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Hora</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Sede</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Categoría</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Usuario</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Asunto</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Agente</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Prioridad</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Estado</th>
              <th className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'uppercase'}}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {ticketsLocal.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500" style={{fontSize: '14px', textTransform: 'lowercase'}}>
                  No hay tickets registrados.
                </td>
              </tr>
            ) : (
              ticketsLocal.map((t, i) => (
                <tr
                  key={t.id || i}
                  className={`border-b transition-colors duration-200${ticketSeleccionado && ticketSeleccionado.id === t.id ? ' ring-2 ring-green-600' : ''}`}
                  style={{ background: '#fff', verticalAlign: 'middle', cursor: 'pointer' }}
                  onDoubleClick={() => handleRowDoubleClick(t)}
                >
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.id).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle whitespace-nowrap" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.fecha).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle whitespace-nowrap" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.hora || '-').toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.sede).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.categoria).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'capitalize'}}>{String(t.usuario).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.asunto).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'capitalize'}}>{String(t.agente).toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{fontSize: '14px', textTransform: 'lowercase'}}>{String(t.prioridad || '-').toLowerCase()}</td>
                  <td className="px-2 py-2 text-center align-middle" style={{ minWidth: 110, fontSize: '14px', textTransform: 'lowercase', background: '#fff' }}>
                    {editandoEstadoId === t.id ? (
                      <select
                        ref={el => selectEstadoRefs.current[t.id] = el}
                        value={t.estado || 'abierto'}
                        onChange={e => { handleEstadoChange(t.id, e.target.value); setEditandoEstadoId(null); }}
                        onBlur={() => setEditandoEstadoId(null)}
                        autoFocus
                        className="w-full font-bold text-center focus:outline-none shadow-sm"
                        style={{
                          background: (t.estado === 'pendiente') ? '#facc15' : (t.estado === 'abierto') ? '#16a34a' : '#64748b',
                          color: (t.estado === 'pendiente') ? '#92400e' : '#fff',
                          border: 'none',
                          textAlign: 'center',
                          letterSpacing: '0.5px',
                          cursor: String(t.estado).toLowerCase() === 'cerrado' ? 'not-allowed' : 'pointer',
                          padding: '8px 0',
                          minWidth: 90,
                          transition: 'background 0.2s, color 0.2s',
                          fontSize: '14px',
                          textTransform: 'lowercase',
                          borderRadius: '10px',
                        }}
                        disabled={String(t.estado).toLowerCase() === 'cerrado'}
                      >
                        {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                      </select>
                    ) : (
                      <span
                        className={
                          t.estado === 'pendiente'
                            ? 'px-4 py-1 rounded-lg font-bold text-yellow-900 bg-yellow-300 shadow-sm'
                            : t.estado === 'abierto'
                            ? 'px-4 py-1 rounded-lg font-bold text-white bg-green-500 shadow-sm'
                            : t.estado === 'cerrado'
                            ? 'px-4 py-1 rounded-lg font-bold text-white bg-slate-500 shadow-sm'
                            : 'px-4 py-1 rounded-lg font-bold bg-gray-200 text-gray-700 shadow-sm'
                        }
                        style={{ display: 'inline-block', minWidth: 110, maxWidth: 110, minHeight: 32, lineHeight: '32px', textAlign: 'center', fontSize: '14px', textTransform: 'lowercase', letterSpacing: '0.5px', cursor: String(t.estado).toLowerCase() !== 'cerrado' ? 'pointer' : 'not-allowed', verticalAlign: 'middle' }}
                        onClick={() => { if (String(t.estado).toLowerCase() !== 'cerrado') setEditandoEstadoId(t.id); }}
                        title={String(t.estado).toLowerCase() !== 'cerrado' ? 'Haz clic para cambiar el estado' : ''}
                      >
                        {t.estado}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2 text-center align-middle break-words whitespace-pre-line" style={{wordBreak:'break-word', fontSize: '14px', textTransform: 'lowercase', maxWidth: 300, whiteSpace: 'pre-line', overflow: 'visible', textOverflow: 'unset'}}>{String(t.descripcion).toLowerCase()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default TicketsRecientes; 