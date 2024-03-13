
const pendingLabel = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const btnDrawTicket = document.querySelector('#drawTicket');
const btnDrawDone = document.querySelector('#drawDone');
const atendiendoLabel = document.querySelector('#atendiendoLabel');

btnDrawTicket.addEventListener('click', onGetDrawTicket);
btnDrawDone.addEventListener('click', onDoneDrawTicket);

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Escritorio es requerido');
}
const deskNumber = searchParams.get('escritorio');
let workingTicket = null;
deskHeader.innerText = deskNumber;

function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none');
  } else {
    noMoreAlert.classList.add('d-none');
  }
  pendingLabel.innerHTML = currentCount;
}

async function loadInitialCount() {
    const pendingTickets = await fetch('api/ticket/pending')
        .then(res => res.json());
    checkTicketCount(pendingTickets.lenght);
}

async function onGetDrawTicket() {
  const {ticket} = await fetch(`http://localhost:3000/api/ticket/draw/${deskNumber}`).then(res => res.json());
  if (ticket) {
    workingTicket = ticket;
    atendiendoLabel.innerHTML = ticket.number;
  }
}

async function onDoneDrawTicket() {
  const {ticket} = await fetch(`http://localhost:3000/api/ticket/done/${workingTicket.id}`,{
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }
      },).then(res => res.json());
  console.log(ticket);
}


function connectToWebSockets() {
  const socket = new WebSocket( 'ws://localhost:3000/ws' );

  socket.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data);
    checkTicketCount(payload.length);
  };

  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );

  };

  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };
}


//Inicializacion
loadInitialCount();
connectToWebSockets();