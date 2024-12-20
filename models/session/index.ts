import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../shared/adapters/sequelize';
import User from '../user';

interface SessionAttributes {
    id: number;
    userId: number;
    device?: string | null;
    ip?: string | null;
    isActive: boolean;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    user?: User;
}

export interface SessionInput extends Optional<SessionAttributes, 'id'> {}
export interface SessionOuput extends Required<SessionAttributes> {}

class Session extends Model<SessionAttributes, SessionInput> implements SessionAttributes {
    declare id: number;
    declare userId: number;
    declare device: string;
    declare ip: string;
    declare isActive: boolean;
    declare metadata: any;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date;

    // external model/s
    declare readonly user: User;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
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
        device: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            validate: {
                isIn: {
                    args: [[true, false]],
                    msg: 'Is active must be true or false',
                },
            },
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        modelName: 'sessions',
        timestamps: true,
        sequelize,
        paranoid: true,
    }
);

export default Session;
