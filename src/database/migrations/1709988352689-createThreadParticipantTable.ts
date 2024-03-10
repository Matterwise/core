import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateThreadParticipantTable1709988352689 implements MigrationInterface {
    name = 'CreateThreadParticipantTable1709988352689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`thread_participant\` (\`participantId\` int NOT NULL, \`parentMessageId\` int NOT NULL, PRIMARY KEY (\`participantId\`, \`parentMessageId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` ADD CONSTRAINT \`FK_f195d1fd4f1e055aef4b26c4fd7\` FOREIGN KEY (\`participantId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` ADD CONSTRAINT \`FK_17a3721b2ffe5e71ee74a1e88a3\` FOREIGN KEY (\`parentMessageId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`thread_participant\` DROP FOREIGN KEY \`FK_17a3721b2ffe5e71ee74a1e88a3\``);
        await queryRunner.query(`ALTER TABLE \`thread_participant\` DROP FOREIGN KEY \`FK_f195d1fd4f1e055aef4b26c4fd7\``);
        await queryRunner.query(`DROP TABLE \`thread_participant\``);
    }

}
