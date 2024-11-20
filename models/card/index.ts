import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../shared/adapters/sequelize';
import Payment from '../payment';

interface CardAttributes {
    id: number;
    userId: number;
    squareCardId: string;
    verificationToken: string;
    enabled: boolean;
    last4: string;
    cardholderName: string;
    cardBrand: string;
    cardType: string;
    expMonth: number;
    expYear: number;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    payments?: Payment[];
}

export interface CardInput extends Optional<CardAttributes, 'id'> {}
export interface CardOuput extends Required<CardAttributes> {}

class Card extends Model<CardAttributes, CardInput> implements CardAttributes {
    declare id: number;
    declare squareCardId: string;
    declare verificationToken: string;
    declare userId: number;
    declare enabled: boolean;
    declare last4: string;
    declare cardholderName: string;
    declare cardBrand: string;
    declare cardType: string;
    declare expMonth: number;
    declare expYear: number;
    declare metadata: any;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date;

    // external model/s
    declare readonly payments: Payment[];
}

Card.init(
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
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Verification token cannot be null',
                },
                notEmpty: {
                    msg: 'Verification token cannot be empty',
                },
            },
        },
        squareCardId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Square Card ID cannot be null',
                },
                notEmpty: {
                    msg: 'Square Card ID cannot be empty',
                },
            },
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            validate: {
                isIn: {
                    args: [[true, false]],
                    msg: 'Enabled value must be true or false',
                },
            },
        },
        last4: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last 4 digits of card cannot be null',
                },
                notEmpty: {
                    msg: 'Last 4 digits of card cannot be empty',
                },
            },
        },
        cardholderName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Card holder name cannot be null',
                },
                notEmpty: {
                    msg: 'Card holder name cannot be empty',
                },
            },
        },
        cardBrand: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Card brand cannot be null',
                },
                notEmpty: {
                    msg: 'Card brand cannot be empty',
                },
            },
        },
        cardType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Card type cannot be null',
                },
                notEmpty: {
                    msg: 'Card type cannot be empty',
                },
            },
        },
        expMonth: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        expYear: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        modelName: 'cards',
        timestamps: true,
        sequelize,
        paranoid: true,
    }
);

Card.hasMany(Payment, { foreignKey: 'cardId' });
Payment.belongsTo(Card, { foreignKey: 'cardId' });

export default Card;
