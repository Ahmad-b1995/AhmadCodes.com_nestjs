import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum Permission {
  CREATE_ARTICLES = 'create_articles',
  READ_ARTICLES = 'read_articles',
  UPDATE_ARTICLES = 'update_articles',
  DELETE_ARTICLES = 'delete_articles',
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('simple-array', { default: '' })
  permissions: Permission[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  // Helper method to check if user has permission
  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  // Helper method to check if user has role
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  // Helper method to check if user is admin
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
} 