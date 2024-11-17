import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../shared/adapters/sequelize';

interface CardAttributes {
    id: number;
    square_card_id: string;
    user_uuid: string;
    enabled: boolean;
    last_4: string;
    cardholder_name: string;
    card_brand: string;
    card_type: string;
    exp_month: number;
    exp_year: number;
    metadata?: any;

    // timestamps
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface CardInput extends Optional<CardAttributes, 'id'> {}
export interface CardOuput extends Required<CardAttributes> {}

class Card extends Model<CardAttributes, CardInput> implements CardAttributes {
    public id!: number;
    public square_card_id!: string;
    public user_uuid!: string;
    public enabled!: boolean;
    public last_4!: string;
    public cardholder_name!: string;
    public card_brand!: string;
    public card_type!: string;
    public exp_month!: number;
    public exp_year!: number;
    public metadata!: any;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
}

Card.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        square_card_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
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
        user_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'User UUID cannot be null',
                },
                notEmpty: {
                    msg: 'User UUID cannot be empty',
                },
                isUUID: {
                    args: 4,
                    msg: 'User UUID is not a valid UUIDv4',
                },
            },
            references: {
                model: 'User',
                key: 'user_uuid',
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
        last_4: {
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
        cardholder_name: {
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
        card_brand: {
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
        card_type: {
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
        exp_month: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        exp_year: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        sequelize,
        paranoid: true,
        deletedAt: 'deleted_at',
    }
);

export default Card;
