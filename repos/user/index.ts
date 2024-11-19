import { User } from '../../models';
import { UserInput } from '../../models/user';
import square from '../../shared/adapters/square';
import common from '../../shared/common';
import ApplicationError from '../../shared/helpers/applicationError';

export default class UserRepo {
    constructor(public Model = User) {}

    async createUser(payload: UserInput) {
        const emailExists = await this.Model.count({
            where: {
                emailAddress: payload.emailAddress,
            },
        });

        if (emailExists) {
            throw new ApplicationError('User with email address already exist', 409);
        }

        const createCustomerResponse = await square.customersApi.createCustomer({
            emailAddress: payload.emailAddress,
            familyName: payload.lastName,
            givenName: payload.firstName,
        });

        const customer = createCustomerResponse.result.customer;
        if (!customer || !customer.id) {
            throw new ApplicationError('Could not get user information from thirdparty', 409);
        }

        return await this.Model.create({
            ...payload,
            squareCustomerId: customer.id,
            metadata: common.toMetadata(customer),
        });
    }

    async updateUser(id: number, payload: Partial<UserInput>) {
        const user = await this.Model.findByPk(id);
        if (!user) throw new ApplicationError('User not found', 404);

        await Promise.all([
            user.update(payload),
            square.customersApi.updateCustomer(user.squareCustomerId, {
                emailAddress: payload.emailAddress,
                familyName: payload.lastName,
                givenName: payload.firstName,
            }),
        ]);

        return user;
    }

    async deleteUser(id: number) {
        const user = await this.Model.findByPk(id);
        if (!user) throw new ApplicationError('User not found', 404);

        await Promise.all([
            user.destroy(),
            square.customersApi.deleteCustomer(user.squareCustomerId),
        ]);
    }
}
