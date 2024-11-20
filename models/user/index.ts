import { DataTypes, Model, Optional } from 'sequelize';
import bcryptjs from 'bcryptjs';
import sequelize from '../../shared/adapters/sequelize';
import Card from '../card';
import Session from '../session';
import Payment from '../payment';

interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    squareCustomerId: string;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    cards?: Card[];
    sessions?: Session[];
    payments?: Payment[];
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'squareCustomerId'> {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public emailAddress!: string;
    public password!: string;
    public squareCustomerId!: string;
    public metadata!: any;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    // external model/s
    public readonly cards!: Card[];
    public readonly sessions!: Session[];
    public readonly payments!: Payment[];
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name cannot be null',
                },
                notEmpty: {
                    msg: 'First name cannot be empty',
                },
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name cannot be null',
                },
                notEmpty: {
                    msg: 'Last name cannot be empty',
                },
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Email address cannot be null',
                },
                notEmpty: {
                    msg: 'Email address cannot be empty',
                },
                isEmail: {
                    msg: 'Invalid email',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            set(value) {
                // encrypting the password before it's being stored in the database
                this.setDataValue('password', bcryptjs.hashSync(value as string, 10));
            },
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password cannot be null',
                },
                notEmpty: {
                    msg: 'Password cannot be empty',
                },
            },
        },
        squareCustomerId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
    },
    {
        modelName: 'users',
        timestamps: true,
        sequelize,
        paranoid: true,
    }
);

User.hasMany(Card, { foreignKey: 'userId' });
Card.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

export default User;