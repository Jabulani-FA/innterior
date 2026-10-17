require('dotenv').config();
const mongoose = require('mongoose');

const migrate = async () => {
  if (!process.env.DATABASE) throw new Error('DATABASE must be configured before running this migration.');
  await mongoose.connect(process.env.DATABASE);
  const collection = mongoose.connection.collection('roleapplications');
  const indexes = await collection.indexes();
  for (const indexName of ['email_1', 'phone_1']) {
    if (indexes.some((index) => index.name === indexName)) {
      await collection.dropIndex(indexName);
      console.log(`Dropped legacy unique index ${indexName}`);
    }
  }
  await mongoose.disconnect();
};

migrate().catch(async (error) => {
  console.error('Role application index migration failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
