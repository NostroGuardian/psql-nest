import { Group } from 'src/group/group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn({ name: 'group' })
  group: Group;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
