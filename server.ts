import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app';

dotenv.config({ path: './.env.local' });

const { DATABASE } = process.env;

if (DATABASE) {
  const DB = DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD || '',
  );

  mongoose.connect(DB).then(() => console.log('DB CONNECTION SUCCESSFUL!'));
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App running on port ${port}...`));