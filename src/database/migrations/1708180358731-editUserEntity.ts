import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditUserEntity1708180358731 implements MigrationInterface {
  name = 'EditUserEntity1708180358731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`username\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`bio\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`statusMessage\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`avatarUrl\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatarUrl\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`statusMessage\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`bio\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
  }
}
