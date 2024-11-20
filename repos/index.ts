import CardRepo from './card';
import PaymentRepo from './payment';
import SessionRepo from './session';
import UserRepo from './user';

class BaseRepo {
    card: CardRepo;
    payment: PaymentRepo;
    session: SessionRepo;
    user: UserRepo;

    constructor() {
        this.card = new CardRepo();
        this.payment = new PaymentRepo();
        this.session = new SessionRepo();
        this.user = new UserRepo();
    }
}

const baseRepo = new BaseRepo();
export default baseRepo;
