import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { UserModel } from "./user.model";
import { WorkCategoryModel } from "./work-categories.model";
import { WorkStatus } from "src/works/enums/work-status.enum";
import { ImageModel } from "./images.model";
import { FeedbackModel } from "./feedbacks.model";

@Entity({ name: 'works' })
export class WorkModel extends BaseEntity {
    
    @ApiProperty({
        description: 'Id work',
        example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    })
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid', })
    public id: string;

    @ApiProperty({ example: 'Create a David BabyJenian', description: 'Title of work' })
    @Column({ type: 'varchar', })
    public name: string;

    @ApiProperty({ example: 'Typical description', description: 'Description of work', nullable: true })
    @Column({ type: 'varchar', nullable: true })
    public description: string | null;

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

    @ApiProperty({ example: '100', description: 'Number of views' })
    @Column({ type: 'int', default: 0 })
    views: number;

    @ApiProperty({
        example: WorkStatus.OPEN,
        description: 'Status of the work (Examples: OPEN, CLOSED, IN PROCESS)',
    })
    @Column({
        type: 'enum',
        enum: WorkStatus,
        default: WorkStatus.OPEN,
    })
    public status: WorkStatus;

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

    @OneToMany(() => FeedbackModel, (feedback) => feedback.work)
    feedbacks: FeedbackModel[];

    @OneToMany(() => ImageModel, (image) => image.work)
    images: ImageModel[];
}