import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../shared/adapters/sequelize';
import Card from '../card';
import User from '../user';

interface PaymentAttributes {
    id: number;
    userId: number;
    cardId: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    squarePaymentId?: string | null;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    card?: Card;
    user?: User;
}

export interface PaymentInput extends Optional<PaymentAttributes, 'id' | 'reference' | 'status'> {}
export interface PaymentOuput extends Required<PaymentAttributes> {}

class Payment extends Model<PaymentAttributes, PaymentInput> implements PaymentAttributes {
    public id!: number;
    public userId!: number;
    public cardId!: number;
    public reference!: string;
    public amount!: number;
    public currency!: string;
    public status!: string;
    public squarePaymentId!: string;
    public metadata!: any;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    // external model/s
    public readonly card!: Card;
    public readonly user!: User;
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'User ID cannot be null',
                },
                notEmpty: {
                    msg: 'User ID cannot be empty',
                },
                isInt: {
                    msg: 'User ID should be an integer',
                },
            },
            references: {
                model: 'users',
                key: 'id',
            },
        },
        cardId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Card ID cannot be null',
                },
                notEmpty: {
                    msg: 'Card ID cannot be empty',
                },
                isInt: {
                    msg: 'Card ID should be an integer',
                },
            },
            references: {
                model: 'cards',
                key: 'id',
            },
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Reference cannot be null',
                },
                notEmpty: {
                    msg: 'Reference cannot be empty',
                },
            },
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Amount cannot be null',
                },
                notEmpty: {
                    msg: 'Amount cannot be empty',
                },
            },
        },
        currency: {
            type: DataTypes.ENUM('EUR', 'USD'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Currency cannot be null',
                },
                notEmpty: {
                    msg: 'Currency cannot be empty',
                },
            },
        },
        status: {
            type: DataTypes.ENUM('initiated', 'failed', 'successful', 'cancelled', 'abandoned'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Status cannot be null',
                },
                notEmpty: {
                    msg: 'Status cannot be empty',
                },
            },
        },
        squarePaymentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        modelName: 'payments',
        timestamps: true,
        sequelize,
        paranoid: true,
    }
);

export default Payment;
