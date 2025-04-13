import { getDbClient, handleError } from './_apiUtils.js';
import { audits, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`[API] ${req.method} /api/audits`, req.query);
  
  const { db, client } = getDbClient();
  
  try {
    // Get user's audits
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
      console.log('Looking up audits for user ID:', userId);
      
      // Get audits for this user
      const result = await db.select()
        .from(audits)
        .where(eq(audits.userId, userId))
        .orderBy(audits.createdAt);
      
      console.log(`Found ${result.length} audits`);
      return res.status(200).json(result);
    }
    
    // Create a new audit
    if (req.method === 'POST') {
      const { 
        email, 
        housingType, 
        houseSize, 
        insulationType, 
        heatingSystem, 
        coolingSystem, 
        applianceData, 
        currentEnergyBill 
      } = req.body;
      
      console.log('Creating new audit with data:', req.body);
      
      if (!email || !housingType || !houseSize) {
        return res.status(400).json({ error: 'Email, housing type, and house size are required' });
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
      
      // Calculate energy score based on inputs
      // This is a simplified calculation - in a real app, this would be more complex
      let energyScore = 50; // Base score
      
      // Adjust score based on housing type
      if (housingType === 'apartment') energyScore += 10;
      if (housingType === 'townhouse') energyScore += 5;
      if (housingType === 'single_family') energyScore -= 5;
      
      // Adjust for house size (smaller is better)
      if (houseSize < 1000) energyScore += 15;
      else if (houseSize < 2000) energyScore += 5;
      else if (houseSize > 3000) energyScore -= 10;
      
      // Adjust for insulation
      if (insulationType === 'high_efficiency') energyScore += 10;
      if (insulationType === 'standard') energyScore += 0;
      if (insulationType === 'poor') energyScore -= 10;
      
      // Clamp score between 0 and 100
      energyScore = Math.max(0, Math.min(100, energyScore));
      
      console.log('Calculated energy score:', energyScore);
      
      // Create audit
      const result = await db.insert(audits)
        .values({
          userId,
          housingType,
          houseSize,
          insulationType,
          heatingSystem,
          coolingSystem,
          applianceData,
          currentEnergyBill,
          energyScore
        })
        .returning();
      
      console.log('New audit created:', result[0]);
      return res.status(201).json(result[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleError(error, res);
  } finally {
    await client.end();
  }
}