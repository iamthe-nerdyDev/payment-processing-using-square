import { DataTypes, Model, Optional } from 'sequelize';
import bcryptjs from 'bcryptjs';
import sequelize from '../../../shared/adapters/sequelize';
import Card from '../card';

interface UserAttributes {
    id: number;
    user_uuid: string;
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    partner_customer_id: string;
    metadata?: any;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'user_uuid'> {}
export interface UserOuput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public user_uuid!: string;
    public first_name!: string;
    public last_name!: string;
    public email_address!: string;
    public password!: string;
    public partner_customer_id!: string;
    public metadata!: any;

    // timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public readonly deleted_at!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        first_name: {
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
        last_name: {
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
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name cannot be null',
                },
                notEmpty: {
                    msg: 'First name cannot be empty',
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
        partner_customer_id: {
            type: DataTypes.STRING,
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

User.hasMany(Card, { foreignKey: 'user_uuid' });
Card.belongsTo(User, { foreignKey: 'user_uuid' });

export default User;
