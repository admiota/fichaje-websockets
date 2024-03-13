export interface Ticket{
    id: string,
    number: number,
    createdAt: Date,
    handleAtDesk?: string //Escritorio1, escritorio2,...
    handleAt?: Date,
    done: boolean
}