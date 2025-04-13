import { getDbClient, handleError } from './_apiUtils.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`[API] ${req.method} /api/users`, req.query);
  
  const { db, client } = getDbClient();
  
  try {
    // Get user by email
    if (req.method === 'GET') {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const result = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      console.log('User lookup result:', result);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(result[0]);
    }
    
    // Create a new user
    if (req.method === 'POST') {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // Check if user already exists
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (existingUser.length > 0) {
        console.log('Returning existing user:', existingUser[0]);
        return res.status(200).json(existingUser[0]); // Return existing user
      }
      
      // Create new user
      console.log('Creating new user with email:', email);
      const result = await db.insert(users)
        .values({ email })
        .returning();
      
      console.log('New user created:', result[0]);
      return res.status(201).json(result[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleError(error, res);
  } finally {
    await client.end();
  }
}