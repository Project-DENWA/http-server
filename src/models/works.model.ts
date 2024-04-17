import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { MetaModel } from "./meta.model";
import { UserModel } from "./user.model";
import { WorkCategoryModel } from "./work-categories.model";

@Entity({ name: 'works' })
export class WorkModel extends BaseEntity {
    
    @ApiProperty({
        description: 'Id work',
        example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    })
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid', })
    public id: string;

    @OneToOne(() => MetaModel)
    @JoinColumn()
    public meta: MetaModel

    @ApiProperty({
        description: "Cost of the project",
        example: '150000'
    })
    @Column({ type: 'numeric' })
    public cost: number;

    @ApiProperty({
        description: 'Project deadline',
        example: '2024-12-31',
    })
    @Column({ type: 'date' })
    public deadline: Date;

    @ManyToOne(() => UserModel, (user) => user.works,)
    @JoinColumn()
    public user: UserModel;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @OneToMany(() => WorkCategoryModel, (workCategory) => workCategory.work)
    workCategories: WorkCategoryModel[];
}