import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  fullName: string;
  @Column('text', { select: false })
  password: string;
  @Column({ unique: true })
  email: string;
  @Column('bool', { default: true })
  isActive: boolean;
  @Column('text', { array: true, default: ['user'] })
  roles: string[];
  @BeforeInsert()
  checkEmail() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkEmailOnUpdate() {
    this.checkEmail();
  }
}
