import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  
  constructor(data?: User) {
    super(data);
  }

  @PrimaryKey
  @Column
  id: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  phone: string;

  @Column
  email: string;

  @Column
  pushNotificationKey: string;
}
