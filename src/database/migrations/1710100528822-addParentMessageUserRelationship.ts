import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentMessageUserRelationship1710100528822 implements MigrationInterface {
    name = 'AddParentMessageUserRelationship1710100528822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`thread_participants_user\` (\`participantId\` int NOT NULL, \`parentMessageId\` int NOT NULL, INDEX \`IDX_64fae0e415e263705f1cc6634e\` (\`participantId\`), INDEX \`IDX_5505bbc980e9fb593f87fe03e5\` (\`parentMessageId\`), PRIMARY KEY (\`participantId\`, \`parentMessageId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`thread_participants_user\` ADD CONSTRAINT \`FK_64fae0e415e263705f1cc6634e6\` FOREIGN KEY (\`participantId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`thread_participants_user\` ADD CONSTRAINT \`FK_5505bbc980e9fb593f87fe03e5e\` FOREIGN KEY (\`parentMessageId\`) REFERENCES \`message\`(\`parentMessageId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`thread_participants_user\` DROP FOREIGN KEY \`FK_5505bbc980e9fb593f87fe03e5e\``);
        await queryRunner.query(`ALTER TABLE \`thread_participants_user\` DROP FOREIGN KEY \`FK_64fae0e415e263705f1cc6634e6\``);
        await queryRunner.query(`DROP INDEX \`IDX_5505bbc980e9fb593f87fe03e5\` ON \`thread_participants_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_64fae0e415e263705f1cc6634e\` ON \`thread_participants_user\``);
        await queryRunner.query(`DROP TABLE \`thread_participants_user\``);
    }

}
