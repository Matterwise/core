import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInviteTable1709668027089 implements MigrationInterface {
    name = 'CreateInviteTable1709668027089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`invite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiresAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` enum ('pending', 'accepted', 'expired', 'declined') NOT NULL DEFAULT 'pending', \`workspaceId\` int NULL, \`senderId\` int NULL, \`inviteeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_2cef34d2245150b9c01e1f7f53f\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspace\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_b8041b4f6ca5d1cbbbf97a50d22\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_b718c2ec0d2707b39ee9a1c915f\` FOREIGN KEY (\`inviteeId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_b718c2ec0d2707b39ee9a1c915f\``);
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_b8041b4f6ca5d1cbbbf97a50d22\``);
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_2cef34d2245150b9c01e1f7f53f\``);
        await queryRunner.query(`DROP TABLE \`invite\``);
    }

}
