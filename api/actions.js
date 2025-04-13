import { getDbClient, handleError } from './_apiUtils.js';
import { actions, recommendations, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`[API] ${req.method} /api/actions`, req.query);
  
  const { db, client } = getDbClient();
  
  try {
    // Get actions for a user
    if (req.method === 'GET') {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // Get user first
      const userResult = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userId = userResult[0].id;
      console.log('Looking up actions for user ID:', userId);
      
      // Get actions for this user
      const result = await db.select()
        .from(actions)
        .where(eq(actions.userId, userId))
        .orderBy(actions.implementationDate);
      
      console.log(`Found ${result.length} actions`);
      return res.status(200).json(result);
    }
    
    // Create a new action (implement a recommendation)
    if (req.method === 'POST') {
      const { 
        email, 
        recommendationId, 
        implementationDate, 
        notes, 
        actualSavingsDollars, 
        actualSavingsKwh 
      } = req.body;
      
      console.log('Creating new action:', req.body);
      
      if (!email || !recommendationId) {
        return res.status(400).json({ error: 'Email and recommendation ID are required' });
      }
      
      // Get user
      const userResult = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userId = userResult[0].id;
      
      // Verify recommendation exists and belongs to user
      const recResult = await db.select()
        .from(recommendations)
        .where(eq(recommendations.id, recommendationId))
        .limit(1);
      
      if (recResult.length === 0) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }
      
      if (recResult[0].userId !== userId) {
        return res.status(403).json({ error: 'Recommendation does not belong to this user' });
      }
      
      // Create action
      const result = await db.insert(actions)
        .values({
          userId,
          recommendationId,
          implementationDate: implementationDate ? new Date(implementationDate) : new Date(),
          notes,
          actualSavingsDollars,
          actualSavingsKwh
        })
        .returning();
      
      console.log('New action created:', result[0]);
      
      // Mark recommendation as completed
      await db.update(recommendations)
        .set({ 
          completed: true,
          updatedAt: new Date()
        })
        .where(eq(recommendations.id, recommendationId));
      
      return res.status(201).json(result[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleError(error, res);
  } finally {
    await client.end();
  }
}