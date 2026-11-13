import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini API client if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API Routes
  app.post('/api/ai-synthesize', async (req, res) => {
    try {
      const { prompt, contextData } = req.body;
      
      if (!ai) {
        // Fallback intelligent simulation if no API key is set yet
        return res.json({
          synthesis: `[AI Simulated Synthesis] Based on current sprint velocity (${contextData?.velocity || '42 pts'}) and ${contextData?.blockers || 2} active blockers:\n\n1. Critical path bottleneck identified in Auth service integration.\n2. Recommended action: Reallocate 2 frontend engineers to assist backend until PR #142 is merged.\n3. Sprint completion probability stands at 84% if blockers are cleared within 24 hours.`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are ProjectPulse AI Copilot, an expert engineering productivity and sprint optimization assistant. Analyze the following project data and user request, providing concise, actionable insights, risk assessments, and recommendations formatted cleanly in Markdown.\n\nContext Data:\n${JSON.stringify(contextData, null, 2)}\n\nUser Request: ${prompt}`
              }
            ]
          }
        ]
      });

      res.json({ synthesis: response.text });
    } catch (error: any) {
      console.error('AI Synthesis error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI synthesis' });
    }
  });

  app.post('/api/ai-breakdown', async (req, res) => {
    try {
      const { taskTitle, taskDescription } = req.body;

      if (!ai) {
        return res.json({
          subtasks: [
            { title: 'Define interface and API contracts', estimate: '2h', assignee: 'Alex Rivera' },
            { title: 'Implement core logic and validation', estimate: '5h', assignee: 'Jordan Lee' },
            { title: 'Write unit and integration tests', estimate: '3h', assignee: 'Sam Taylor' },
            { title: 'Code review and deployment verification', estimate: '2h', assignee: 'Morgan Wu' }
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Break down the following engineering task into 3-5 concrete actionable subtasks with estimated hours and suggested assignees (Alex Rivera, Jordan Lee, Sam Taylor, Morgan Wu, Taylor Swift). Return valid JSON array of objects with keys: title (string), estimate (string), assignee (string).\n\nTask Title: ${taskTitle}\nDescription: ${taskDescription}`
              }
            ]
          }
        ]
      });

      let text = response.text || '';
      // Clean markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const subtasks = JSON.parse(text);
      res.json({ subtasks });
    } catch (error: any) {
      console.error('AI Breakdown error:', error);
      res.status(500).json({ 
        subtasks: [
          { title: 'Requirements & Architecture review', estimate: '2h', assignee: 'Alex Rivera' },
          { title: 'Implementation & Testing', estimate: '6h', assignee: 'Jordan Lee' }
        ]
      });
    }
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ProjectPulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
