import { WssService } from './wss.service';
import { Ticket } from './../../domain/interfaces/ticket';
import { CreateTicketDto } from './../../domain/dtos/createTicket.dto';
import { UuidAdapter } from './../../config/uuid.adapter';

export class TicketService {
    constructor(
        private readonly wssService = WssService.instance
    ) { }
    
    public tickets: Ticket[] = [
        {id:UuidAdapter.v4(), number:1, createdAt:new Date(), done:false},
        {id:UuidAdapter.v4(), number:2, createdAt:new Date(), done:false},
        {id:UuidAdapter.v4(), number:3, createdAt:new Date(), done:false},
        {id:UuidAdapter.v4(), number:4, createdAt:new Date(), done:false},
        {id:UuidAdapter.v4(), number:5, createdAt:new Date(), done:false},
        {id:UuidAdapter.v4(), number:6, createdAt:new Date(), done:false},
    ];
    private readonly workingOnTickets: Ticket[] = [];

    public get pendingTickets(): Ticket[]{
        return this.tickets.filter(ticket => !ticket.handleAtDesk);
    }

    public get lastWorkingOnTickets():Ticket[] {
        return this.workingOnTickets.slice(0, 4);
    }

    public get lastTicketNumber():number {
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
    }

    public createTicket(ticketDto?: CreateTicketDto) {
        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber+1,
            createdAt: new Date(),
            handleAt: undefined,
            handleAtDesk: undefined,
            done: false
        }

        this.tickets.push(ticket);
        //TODO: WS(web socket cliente para recibir este último ticket creado)
        this.onTicketNumberChanged();
        return ticket;
    }

    public drawTicket(desk: string) {
        const ticket = this.tickets.find(ticket => !ticket.handleAtDesk);
        if (!ticket) return { status: 'error', message: 'No hay tickets pendientes' };

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this.workingOnTickets.unshift({...ticket});

        //TODO WS para indicar al cliente que este ticket ya está siendo tomado
        this.onGetDrawTickets();
        return { status: 'ok', ticket };
    }

    public onFinishedTicket(id: string) {
        const ticket = this.tickets.find(ticket => ticket.id === id);
        if (!ticket) return { status: 'error', message: 'Ticket no encontrado' };
        this.tickets.map((ticket) => {
            if (ticket.id === id) {
                ticket.done = true;
            }
        });
        //this.onTicketNumberChanged();
        return { status: 'ok', ticket };
    }


    private onTicketNumberChanged() {
        this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
    }

    private onGetDrawTickets() {
         this.wssService.sendWorkingTicked('on-send-working-tickets', this.workingOnTickets)
    }
}