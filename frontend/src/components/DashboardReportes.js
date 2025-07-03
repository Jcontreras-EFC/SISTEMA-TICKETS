import React from 'react';

const DashboardReportes = () => {
<<<<<<< HEAD
=======
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

>>>>>>> parent of 9de7d79 (BACK-UP CORREO)
  return (
    <div className="pl-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    </div>
  );
};

export default DashboardReportes; 