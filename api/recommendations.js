import { getDbClient, handleError } from './_apiUtils.js';
import { recommendations, audits, users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`[API] ${req.method} /api/recommendations`, req.query);
  
  const { db, client } = getDbClient();
  
  try {
    // Get recommendations for a user
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
      console.log('Looking up recommendations for user ID:', userId);
      
      // Get recommendations for this user
      const result = await db.select()
        .from(recommendations)
        .where(eq(recommendations.userId, userId))
        .orderBy(recommendations.priority);
      
      console.log(`Found ${result.length} recommendations`);
      return res.status(200).json(result);
    }
    
    // Generate recommendations based on audit
    if (req.method === 'POST') {
      const { auditId, email } = req.body;
      console.log('Generating recommendations for audit:', auditId);
      
      if (!auditId || !email) {
        return res.status(400).json({ error: 'Audit ID and email are required' });
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
      
      // Get audit details
      const auditResult = await db.select()
        .from(audits)
        .where(eq(audits.id, auditId))
        .limit(1);
      
      if (auditResult.length === 0) {
        return res.status(404).json({ error: 'Audit not found' });
      }
      
      const audit = auditResult[0];
      console.log('Found audit data:', audit);
      
      // Generate recommendations based on audit
      // This is where you'd have complex logic to generate personalized recommendations
      // For this example, we'll create some basic recommendations
      
      const recommendationsToCreate = [];
      
      // Insulation recommendation if needed
      if (audit.insulationType === 'poor') {
        recommendationsToCreate.push({
          auditId,
          userId,
          title: 'Upgrade Insulation',
          description: 'Install high-efficiency insulation to reduce heating and cooling costs.',
          potentialSavingsDollars: Math.round(audit.currentEnergyBill * 0.15),
          potentialSavingsKwh: Math.round(audit.currentEnergyBill * 10),
          implementationCost: 1500,
          paybackPeriod: Math.round(1500 / (audit.currentEnergyBill * 0.15)),
          priority: 1
        });
      }
      
      // Heating system recommendation if needed
      if (audit.heatingSystem === 'oil' || audit.heatingSystem === 'electric_resistance') {
        recommendationsToCreate.push({
          auditId,
          userId,
          title: 'Upgrade Heating System',
          description: 'Install a high-efficiency heat pump system to reduce heating costs.',
          potentialSavingsDollars: Math.round(audit.currentEnergyBill * 0.25),
          potentialSavingsKwh: Math.round(audit.currentEnergyBill * 15),
          implementationCost: 3000,
          paybackPeriod: Math.round(3000 / (audit.currentEnergyBill * 0.25)),
          priority: 2
        });
      }
      
      // Add LED lights recommendation for everyone
      recommendationsToCreate.push({
        auditId,
        userId,
        title: 'Switch to LED Lighting',
        description: 'Replace all incandescent and CFL bulbs with LED lighting.',
        potentialSavingsDollars: Math.round(audit.currentEnergyBill * 0.08),
        potentialSavingsKwh: Math.round(audit.currentEnergyBill * 5),
        implementationCost: 200,
        paybackPeriod: Math.round(200 / (audit.currentEnergyBill * 0.08)),
        priority: 3
      });
      
      // Add smart thermostat for everyone
      recommendationsToCreate.push({
        auditId,
        userId,
        title: 'Install Smart Thermostat',
        description: 'Install a programmable smart thermostat to optimize heating and cooling.',
        potentialSavingsDollars: Math.round(audit.currentEnergyBill * 0.12),
        potentialSavingsKwh: Math.round(audit.currentEnergyBill * 8),
        implementationCost: 250,
        paybackPeriod: Math.round(250 / (audit.currentEnergyBill * 0.12)),
        priority: 2
      });
      
      // Add energy star appliances if they have old ones
      if (audit.applianceData && !audit.applianceData.energyStarAppliances) {
        recommendationsToCreate.push({
          auditId,
          userId,
          title: 'Upgrade to ENERGY STAR Appliances',
          description: 'Replace older appliances with ENERGY STAR certified models.',
          potentialSavingsDollars: Math.round(audit.currentEnergyBill * 0.10),
          potentialSavingsKwh: Math.round(audit.currentEnergyBill * 7),
          implementationCost: 1200,
          paybackPeriod: Math.round(1200 / (audit.currentEnergyBill * 0.10)),
          priority: 4
        });
      }
      
      console.log(`Creating ${recommendationsToCreate.length} recommendations`);
      
      // Create all recommendations
      const results = [];
      for (const rec of recommendationsToCreate) {
        const result = await db.insert(recommendations)
          .values(rec)
          .returning();
        results.push(result[0]);
      }
      
      return res.status(201).json(results);
    }
    
    // Update recommendation (mark as completed)
    if (req.method === 'PUT') {
      const { id, completed } = req.body;
      console.log('Updating recommendation:', id, 'completed:', completed);
      
      if (!id) {
        return res.status(400).json({ error: 'Recommendation ID is required' });
      }
      
      const result = await db.update(recommendations)
        .set({ 
          completed: completed === true,
          updatedAt: new Date()
        })
        .where(eq(recommendations.id, id))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }
      
      console.log('Recommendation updated:', result[0]);
      return res.status(200).json(result[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleError(error, res);
  } finally {
    await client.end();
  }
}