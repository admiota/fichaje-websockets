function renderTickets(tickets = []) {
  for (let i = 0; i < tickets.length; i++){
    if (i >= 4) break;
    const ticket = tickets[i];
    const lblTicket = document.querySelector(`lbl-ticket-0${i + 1}`);
    const lblDesk = document.querySelector(`lbl-desk-0${i + 1}`);

    lblTicket.innerHTML = `Ticket ${ticket.number}`;
    lblDesk.innerHTML = `Desk ${ticket.handleAtDesk}`;
  }
}

async function getWorkingOnTickets() {
  const arrWorkingOnTickets = await fetch('http://localhost:3000/api/ticket/working-on').then(resp => resp.json()).then(arrTickets => arrTickets);

  renderTickets(arrWorkingOnTickets);
}


function connectToWebSockets() {

  const socket = new WebSocket( 'ws://localhost:3000/ws' );

    socket.onmessage = (event) => {
      console.log(event);
      const { type, payload } = JSON.parse(event.data);
      renderTickets(payload);
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

getWorkingOnTickets();
connectToWebSockets();