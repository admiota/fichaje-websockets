
document.addEventListener("DOMContentLoaded", function () {
    let currentTicket=undefined;
    const lastTicketSpan = document.querySelector('#lbl-new-ticket');
    async function getLastTicket() {
        await fetch('http://localhost:3000/api/ticket/last')
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(lastTicket => {
                currentTicket = lastTicket;
                // Mostrar el último ticket en la consola
                
                lastTicketSpan.innerHTML = currentTicket;
            })
            .catch(error => {
                console.error('Error fetching last ticket:', error);
            });
    }
    getLastTicket();
    
    const buttonCreateTicket = document.getElementById('createButton');
    buttonCreateTicket.addEventListener('click', onCreate);


    async function onCreate() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const newTicket = await fetch('http://localhost:3000/api/ticket/',requestOptions)
            .then(response =>  response.json())
            .catch(error => {
                console.error('Error fetching last ticket:', error);
            });
            
            lastTicketSpan.innerHTML = newTicket.number;
        }
});