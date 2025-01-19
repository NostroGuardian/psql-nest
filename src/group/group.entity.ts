import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  alias: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column()
  description: string;
}
