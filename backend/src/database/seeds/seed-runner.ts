import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from '../../data-source';
import * as fs from 'fs';
import * as path from 'path';

async function runSeeds() {
  await AppDataSource.initialize();
  console.log('Database connected. Running seeds...');

  const seedsDir = path.join(__dirname);
  const sqlFiles = fs
    .readdirSync(seedsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    for (const file of sqlFiles) {
      console.log(`Running seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      await queryRunner.query(sql);
    }

    await queryRunner.commitTransaction();
    console.log('All seeds executed successfully.');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runSeeds();
