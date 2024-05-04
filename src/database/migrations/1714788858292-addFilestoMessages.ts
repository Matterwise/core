import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilestoMessages1714788858292 implements MigrationInterface {
    name = 'AddFilestoMessages1714788858292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message_files_file\` (\`messageId\` int NOT NULL, \`fileId\` varchar(36) NOT NULL, INDEX \`IDX_243acfb9a9e56c28c9f43055c7\` (\`messageId\`), INDEX \`IDX_fc56b6b90ec366b402fc86bbe4\` (\`fileId\`), PRIMARY KEY (\`messageId\`, \`fileId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`message_files_file\` ADD CONSTRAINT \`FK_243acfb9a9e56c28c9f43055c76\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`message_files_file\` ADD CONSTRAINT \`FK_fc56b6b90ec366b402fc86bbe41\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message_files_file\` DROP FOREIGN KEY \`FK_fc56b6b90ec366b402fc86bbe41\``);
        await queryRunner.query(`ALTER TABLE \`message_files_file\` DROP FOREIGN KEY \`FK_243acfb9a9e56c28c9f43055c76\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatarUrl\` varchar(255) NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_fc56b6b90ec366b402fc86bbe4\` ON \`message_files_file\``);
        await queryRunner.query(`DROP INDEX \`IDX_243acfb9a9e56c28c9f43055c7\` ON \`message_files_file\``);
        await queryRunner.query(`DROP TABLE \`message_files_file\``);
    }

}
