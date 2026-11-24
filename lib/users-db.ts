import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string; // hash de bcrypt, nunca la contraseña real
};

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const rows = await sql`
    SELECT id, name, email, password
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
  `;
  return rows[0] as UserRecord | undefined;
}
