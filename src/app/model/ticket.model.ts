import { User } from './user.model';

export class Ticket {
    constructor(
        public id: string,
        public user: User,
        public date: string,
        public title: string,
        // tslint:disable-next-line:variable-name
        public number: number,
        public status: string,
        public priority: string,
        public assignedUser: User,
        public description: string,
        public image: string,
        public changes: Array<string>
    ) {}
}
