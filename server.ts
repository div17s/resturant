import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Vite dev integration if needed, but in prod we'd configure it
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Middleware (Simulation)
const validateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer secret-admin-token') { // In real app, verify JWT
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Concierge API Proxy (Hiding AI Footprint)
app.post('/api/concierge', apiLimiter, async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration error' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    
    const systemPrompt = `You are "Sia", the AI dining concierge at Olive & Restro, Indore.
You are professional, warm, and helpful. You never mention being an AI or model.
Help guests with menu, reservations, and timings. Keep it human.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      ]
    });

    res.json({ content: result.text });
  } catch (error) {
    console.error('Concierge Error:', error);
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
});

// User store for simulated database
interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

const registeredUsers: StoredUser[] = [
  {
    id: 'user_admin',
    name: 'Admin',
    email: 'admin@oliveandrestro.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_demo',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91 98765 43210',
    role: 'customer',
    createdAt: new Date().toISOString(),
  }
];

// Register API
app.post('/api/auth/register', apiLimiter, (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please sign in instead.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);

  res.status(201).json({
    token: `token_${newUser.id}_${Date.now()}`,
    user: {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    }
  });
});

// Login API
app.post('/api/auth/login', apiLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = registeredUsers.find(
    u => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (user) {
    const token = user.role === 'admin' ? 'secret-admin-token' : `token_${user.id}_${Date.now()}`;
    return res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  }

  res.status(401).json({ error: 'Invalid email or password. Please check your credentials or register.' });
});

// Google Login Simulation
app.post('/api/auth/google', apiLimiter, (req, res) => {
  const { email, name } = req.body;
  const userEmail = (email || 'guest@example.com').trim().toLowerCase();
  const userName = name || 'Valued Guest';

  let user = registeredUsers.find(u => u.email.toLowerCase() === userEmail);
  if (!user) {
    user = {
      id: `user_google_${Date.now()}`,
      name: userName,
      email: userEmail,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    registeredUsers.push(user);
  }

  res.json({
    token: `token_google_${user.id}`,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

// Shared Reservation Store on Backend (initialized with some mock records)
interface ReservationRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  specialRequest?: string;
  tableAllocated?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No-show';
  createdAt: string;
}

let backendReservations: ReservationRecord[] = [
  {
    id: 'EO-RES-801',
    fullName: 'Aarav Mehta',
    phone: '+91 00000 00000',
    email: 'aarav.m@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: 2,
    occasion: 'Casual Dining',
    specialRequest: 'Window table preferred',
    tableAllocated: 'Table 4 (Window)',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'EO-RES-802',
    fullName: 'Priya & Vikram Sharma',
    phone: '+91 00000 00000',
    email: 'priya.sharma@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 6,
    occasion: 'Anniversary',
    specialRequest: 'Floral arrangement requested',
    tableAllocated: 'Private Dining Enclave',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'EO-RES-803',
    fullName: 'Dr. Siddharth Kapoor',
    phone: '+91 00000 00000',
    email: 'siddharth.k@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '20:30',
    guests: 4,
    occasion: "Chef's Tasting",
    specialRequest: 'Nut allergy noted for 1 guest',
    tableAllocated: "Chef's Counter",
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

// Active client streams for real-time Server-Sent Events (SSE) updates!
let sseClients: any[] = [];

const notifyClientsOfUpdate = () => {
  const payload = JSON.stringify({ type: 'update', data: backendReservations });
  sseClients.forEach(client => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      // client connection already closed or errored
    }
  });
};

// SSE Stream for Admin console real-time updates!
app.get('/api/reservations/stream', (req, res) => {
  const token = req.query.token;
  if (token !== 'secret-admin-token') {
    return res.status(401).json({ error: 'Unauthorized stream access' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial load
  res.write(`data: ${JSON.stringify({ type: 'initial', data: backendReservations })}\n\n`);

  const clientObj = res;
  sseClients.push(clientObj);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== clientObj);
  });
});

// GET reservations (Secured so that ONLY admin can fetch everything, or customers fetch their own)
app.get('/api/reservations', (req, res) => {
  const authHeader = req.headers.authorization;
  const emailQuery = req.query.email as string;

  if (authHeader === 'Bearer secret-admin-token') {
    // Admin gets all reservations
    return res.json(backendReservations);
  }

  // Non-admins can ONLY filter by their own email to avoid data leaks!
  if (emailQuery) {
    const filtered = backendReservations.filter(
      r => r.email.toLowerCase() === emailQuery.trim().toLowerCase()
    );
    return res.json(filtered);
  }

  // Otherwise, return empty or unauthorized to protect data privacy
  return res.status(401).json({ error: 'Unauthorized to view all reservation records.' });
});

// Create reservation
app.post('/api/reservations', apiLimiter, (req, res) => {
  const { fullName, phone, email, date, time, guests, occasion, specialRequest } = req.body;
  
  if (!fullName || !phone || !email || !date || !time || !guests) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const id = 'EO-RES-' + Math.floor(1000 + Math.random() * 9000);
  const tableAllocated =
    guests > 8
      ? 'Private Dining Enclave'
      : `Table ${Math.floor(1 + Math.random() * 10)}`;

  const newRecord: ReservationRecord = {
    id,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    date,
    time,
    guests: parseInt(guests, 10),
    occasion: occasion || 'Casual Dining',
    specialRequest: specialRequest || '',
    tableAllocated,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  backendReservations.unshift(newRecord);
  notifyClientsOfUpdate();

  res.status(201).json(newRecord);
});

// Patch Reservation Status or Details
app.patch('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const { status, tableAllocated, guests, date, time } = req.body;

  const targetIndex = backendReservations.findIndex(r => r.id === id);
  if (targetIndex === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const target = backendReservations[targetIndex];

  // Security Gate: Ensure only owner can modify or only Admin can modify status
  const isAdminRequest = authHeader === 'Bearer secret-admin-token';
  const isOwnerRequest = req.query.email && target.email.toLowerCase() === (req.query.email as string).toLowerCase();

  if (!isAdminRequest && !isOwnerRequest) {
    return res.status(403).json({ error: 'Access denied: You can only modify your own reservations.' });
  }

  // Update allowed fields
  if (status && isAdminRequest) {
    target.status = status;
  }
  if (status && isOwnerRequest && status === 'Cancelled') {
    // Owner is allowed to cancel their own reservation
    target.status = 'Cancelled';
  }
  if (tableAllocated && isAdminRequest) {
    target.tableAllocated = tableAllocated;
  }
  if (guests) target.guests = parseInt(guests, 10);
  if (date) target.date = date;
  if (time) target.time = time;

  notifyClientsOfUpdate();
  res.json(target);
});

// Serve static files from Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In dev, Vite handles the frontend. This server acts as an API proxy.
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = await (await import('fs')).readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      );
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

app.listen(port, () => {
  console.log(`Server executing on port ${port}`);
});
