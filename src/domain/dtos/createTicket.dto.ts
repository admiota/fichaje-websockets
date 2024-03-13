export class CreateTicketDto {
    private constructor(
        public readonly id:string,
        public readonly number:number,
        public readonly createdAt:Date,
        public readonly done: boolean,
        public readonly handleAtDesk?: string,
        public readonly handleAt?: Date,
    ) {
    }

    static create(object: {[key:string]:any}):[error?:string, createTicketDto?:CreateTicketDto] {
        const { id, number, createdAt, handleAtDesk, handleAt, done } = object;
        if (!id) return ['Missing id'];
        if (!number) return ['Missing number'];
        if (!createdAt) return ['Missing CreatedAt'];
        if (!handleAtDesk) return ['Missing HandleAtDesk'];
        if (!handleAt) return ['Missing HandleAt'];
        if (!done) return ['Missing Done'];

        return [undefined, new CreateTicketDto(id, number, createdAt, done, handleAtDesk, handleAt)];
    }
}