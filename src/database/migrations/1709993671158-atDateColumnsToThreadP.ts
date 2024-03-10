import { MigrationInterface, QueryRunner } from "typeorm";

export class AtDateColumnsToThreadP1709993671158 implements MigrationInterface {
    name = 'AtDateColumnsToThreadP1709993671158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`thread_participant\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`thread_participant\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` DROP COLUMN \`createdAt\``);
    }

}
