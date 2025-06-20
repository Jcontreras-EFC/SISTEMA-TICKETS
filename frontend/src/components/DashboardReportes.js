import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaTicketAlt, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { format, parseISO, getISOWeek, getMonth, getYear } from 'date-fns';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, TimeScale);

const coloresCorporativos = {
  verde: '#16a34a',
  azul: '#2563eb',
  gris: '#64748b',
  dorado: '#eab308',
  rojo: '#dc2626',
  naranja: '#ea580c',
  morado: '#7c3aed',
  fondo: 'rgba(22,163,74,0.08)',
  fondo2: 'rgba(37,99,235,0.08)',
};

const DashboardReportes = () => {
  const [tickets, setTickets] = useState([]);
  const [agrupacion, setAgrupacion] = useState('dia'); // 'dia', 'semana', 'mes'

  useEffect(() => {
    fetch('http://localhost:3001/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  // Tickets por sede
  const sedes = [...new Set(tickets.map(t => t.sede))];
  const ticketsPorSede = sedes.map(sede => tickets.filter(t => t.sede === sede).length);

  // Tickets por agente
  const agentes = [...new Set(tickets.map(t => t.agente))];
  const ticketsPorAgente = agentes.map(agente => tickets.filter(t => t.agente === agente).length);

  // Agrupación dinámica para el gráfico de tickets por fecha
  let labelsFechas = [];
  let ticketsPorFecha = [];
  if (agrupacion === 'dia') {
    labelsFechas = [...new Set(tickets.map(t => t.fecha))].sort();
    ticketsPorFecha = labelsFechas.map(dia => tickets.filter(t => t.fecha === dia).length);
  } else if (agrupacion === 'semana') {
    // Agrupar por semana ISO (Año-Semana)
    const semanas = [...new Set(tickets.map(t => {
      const d = parseISO(t.fecha);
      return `${getYear(d)}-S${String(getISOWeek(d)).padStart(2, '0')}`;
    }))].sort();
    labelsFechas = semanas;
    ticketsPorFecha = semanas.map(sem => tickets.filter(t => {
      const d = parseISO(t.fecha);
      return `${getYear(d)}-S${String(getISOWeek(d)).padStart(2, '0')}` === sem;
    }).length);
  } else if (agrupacion === 'mes') {
    // Agrupar por mes (Año-Mes)
    const meses = [...new Set(tickets.map(t => {
      const d = parseISO(t.fecha);
      return `${getYear(d)}-${String(getMonth(d)+1).padStart(2, '0')}`;
    }))].sort();
    labelsFechas = meses;
    ticketsPorFecha = meses.map(mes => tickets.filter(t => {
      const d = parseISO(t.fecha);
      return `${getYear(d)}-${String(getMonth(d)+1).padStart(2, '0')}` === mes;
    }).length);
  }

  // Tickets por categoría
  const categorias = [...new Set(tickets.map(t => t.categoria))];
  const ticketsPorCategoria = categorias.map(categoria => tickets.filter(t => t.categoria === categoria).length);

  // Tickets por prioridad
  const prioridades = [...new Set(tickets.map(t => t.prioridad))];
  const ticketsPorPrioridad = prioridades.map(prioridad => tickets.filter(t => t.prioridad === prioridad).length);

  // Resúmenes
  const total = tickets.length;
  const abiertos = tickets.filter(t => t.estado === 'abierto').length;
  const pendientes = tickets.filter(t => t.estado === 'pendiente').length;
  const cerrados = tickets.filter(t => t.estado === 'cerrado').length;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* Fondo con imagen, blur y overlay degradado */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/dashboard.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px) grayscale(0.18) brightness(0.65)',
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
          background: 'linear-gradient(to bottom, rgba(30,40,60,0.18) 0%, rgba(30,40,60,0.32) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-10" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="w-full max-w-7xl mx-auto rounded-3xl shadow-2xl px-8 py-10 border border-green-300"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.18)',
            position: 'relative',
            zIndex: 2,
            border: '2.5px solid #16a34a',
          }}
        >
          <div className="flex justify-center mt-0 mb-6 w-full" style={{marginTop: '-1.5rem'}}>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 text-center uppercase tracking-widest drop-shadow-lg bg-white/90 rounded-xl px-6 py-2 border-2 border-green-200 shadow" style={{letterSpacing:'0.08em', textShadow:'0 2px 8px #b6e7c9, 0 1px 0 #fff'}}>Dashboard de Reportes</h2>
          </div>
          {/* Cuadros resumen grandes */}
          <div className="flex flex-wrap justify-center gap-4 mb-2 w-full">
            <div className="flex-1 min-w-[220px] max-w-xs rounded-2xl shadow border-0 flex flex-col items-center py-6 px-4 mx-2 bg-blue-600">
              <div className="text-5xl font-bold text-white mb-1 drop-shadow">{total}</div>
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <FaTicketAlt className="text-white text-lg drop-shadow" />
                Total Tickets
              </div>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs rounded-2xl shadow border-0 flex flex-col items-center py-6 px-4 mx-2 bg-green-600">
              <div className="text-5xl font-bold text-white mb-1 drop-shadow">{abiertos}</div>
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <FaExclamationCircle className="text-white text-lg drop-shadow" />
                Tickets Abiertos
              </div>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs rounded-2xl shadow border-0 flex flex-col items-center py-6 px-4 mx-2 bg-yellow-500">
              <div className="text-5xl font-bold text-white mb-1 drop-shadow">{pendientes}</div>
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <FaExclamationTriangle className="text-white text-lg drop-shadow" />
                Tickets Pendientes
              </div>
            </div>
            <div className="flex-1 min-w-[220px] max-w-xs rounded-2xl shadow border-0 flex flex-col items-center py-6 px-4 mx-2 bg-gray-500">
              <div className="text-5xl font-bold text-white mb-1 drop-shadow">{cerrados}</div>
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <FaInfoCircle className="text-white text-lg drop-shadow" />
                Tickets Cerrados
              </div>
            </div>
          </div>
          {/* Primera fila de gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-green-100 flex flex-col items-center mx-auto" style={{maxWidth:'28rem', height:'18rem'}}>
              <h3 className="text-xl font-bold mb-4 text-center text-green-700 uppercase tracking-wide drop-shadow">Tickets por Sede</h3>
              <div className="w-full" style={{height:'12rem'}}>
                <Pie
                  data={{
                    labels: sedes,
                    datasets: [{
                      data: ticketsPorSede,
                      backgroundColor: [coloresCorporativos.verde, coloresCorporativos.azul, coloresCorporativos.dorado, coloresCorporativos.gris, '#a21caf'],
                      borderColor: '#fff',
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: { color: '#222', font: { size: 14, weight: 'bold' } }
                      },
                      tooltip: { enabled: true }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center mx-auto" style={{maxWidth:'28rem', height:'18rem'}}>
              <h3 className="text-xl font-bold mb-4 text-center text-blue-700 uppercase tracking-wide drop-shadow">Tickets por Agente</h3>
              <div className="w-full" style={{height:'12rem'}}>
                <Bar
                  data={{
                    labels: agentes,
                    datasets: [{
                      label: 'Tickets',
                      data: ticketsPorAgente,
                      backgroundColor: [
                        coloresCorporativos.verde,
                        coloresCorporativos.azul,
                        coloresCorporativos.dorado,
                        coloresCorporativos.morado,
                        coloresCorporativos.naranja
                      ],
                      borderColor: [
                        coloresCorporativos.verde,
                        coloresCorporativos.azul,
                        coloresCorporativos.dorado,
                        coloresCorporativos.morado,
                        coloresCorporativos.naranja
                      ],
                      borderWidth: 2,
                      borderRadius: 12,
                      hoverBackgroundColor: coloresCorporativos.fondo2,
                    }],
                  }}
                  options={{
                    indexAxis: 'y',
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#64748b', font: { weight: 'bold', size: 14 } }
                      },
                      y: {
                        grid: { display: false },
                        ticks: {
                          color: '#2563eb',
                          font: { weight: 'bold', size: 13 },
                          autoSkip: false,
                          padding: 24,
                          maxWidth: 180,
                        }
                      }
                    },
                    layout: {
                      padding: {
                        left: 24,
                        right: 10,
                        top: 10,
                        bottom: 10
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-yellow-100 flex flex-col items-center mx-auto" style={{maxWidth:'28rem', height:'18rem'}}>
              <div className="w-full flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-center text-yellow-700 uppercase tracking-wide drop-shadow">Tickets por {agrupacion === 'dia' ? 'Día' : agrupacion === 'semana' ? 'Semana' : 'Mes'}</h3>
                <select
                  className="ml-4 px-3 py-1 rounded-lg border border-yellow-400 bg-yellow-50 text-yellow-800 font-semibold text-sm shadow focus:outline-none"
                  value={agrupacion}
                  onChange={e => setAgrupacion(e.target.value)}
                  style={{ minWidth: 90 }}
                >
                  <option value="dia">Día</option>
                  <option value="semana">Semana</option>
                  <option value="mes">Mes</option>
                </select>
              </div>
              <div className="w-full" style={{height:'12rem'}}>
                <Line
                  data={{
                    labels: labelsFechas,
                    datasets: [{
                      label: 'Tickets',
                      data: ticketsPorFecha,
                      borderColor: coloresCorporativos.verde,
                      backgroundColor: 'rgba(22,163,74,0.18)',
                      pointBackgroundColor: coloresCorporativos.dorado,
                      pointBorderColor: coloresCorporativos.verde,
                      tension: 0.3,
                      fill: true,
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: '#eab308', font: { weight: 'bold' } }
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#64748b', font: { weight: 'bold' } }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {/* Segunda fila de gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-8">
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-purple-100 flex flex-col items-center h-80 max-h-96 mx-auto" style={{maxWidth:'28rem'}}>
              <h3 className="text-xl font-bold mb-4 text-center text-purple-700 uppercase tracking-wide drop-shadow">Tickets por Categoría</h3>
              <div className="w-full h-52">
                <Pie
                  data={{
                    labels: categorias,
                    datasets: [{
                      data: ticketsPorCategoria,
                      backgroundColor: [coloresCorporativos.morado, coloresCorporativos.naranja, coloresCorporativos.azul, coloresCorporativos.verde, coloresCorporativos.dorado],
                      borderColor: '#fff',
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: { color: '#222', font: { size: 14, weight: 'bold' } }
                      },
                      tooltip: { enabled: true }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-red-100 flex flex-col items-center h-80 max-h-96 mx-auto" style={{maxWidth:'28rem'}}>
              <h3 className="text-xl font-bold mb-4 text-center text-red-700 uppercase tracking-wide drop-shadow">Tickets por Prioridad</h3>
              <div className="w-full h-52">
                <Bar
                  data={{
                    labels: prioridades,
                    datasets: [{
                      label: 'Tickets',
                      data: ticketsPorPrioridad,
                      backgroundColor: [
                        coloresCorporativos.rojo,    // Alta
                        coloresCorporativos.dorado,  // Media
                        coloresCorporativos.gris     // Baja
                      ],
                      borderColor: [
                        coloresCorporativos.rojo,
                        coloresCorporativos.dorado,
                        coloresCorporativos.gris
                      ],
                      borderWidth: 2,
                      borderRadius: 8,
                      hoverBackgroundColor: coloresCorporativos.azul,
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: '#dc2626', font: { weight: 'bold' } }
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#64748b', font: { weight: 'bold' } }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReportes; 