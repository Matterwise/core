import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContentFilesConstraint1714800568879 implements MigrationInterface {
    name = 'AddContentFilesConstraint1714800568879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`content\` \`content\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`content\` \`content\` varchar(255) NOT NULL`);
    }

}
