// Crea la tabla users (si no existe) y agrega o actualiza una cuenta.
// Uso: npm run seed:user -- <email> <password> "<name>"
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const [email, password, name = 'Bishopric'] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run seed:user -- <email> <password> "<name>"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

// Nunca guardamos la contraseña real: solo su hash de bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

await sql`
  INSERT INTO users (name, email, password)
  VALUES (${name}, ${email.trim().toLowerCase()}, ${hashedPassword})
  ON CONFLICT (email)
  DO UPDATE SET password = EXCLUDED.password, name = EXCLUDED.name
`;

console.log(`✅ User ${email} is ready.`);
