// auth-service.ts - Clean version without secrets
// This file should pass the secret detection hook

import jwt from 'jsonwebtoken';
import { Database } from './db';

// ✅ Secrets loaded from environment variables
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const DATABASE_URL = process.env.DATABASE_URL;
const API_KEY = process.env.API_KEY;

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

class AuthService {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }

  async login(username: string, password: string) {
    // ✅ Secure parameterized query
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const user = await this.db.query(query, [username, password]);
    
    if (user) {
      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return { success: true, token };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  async connectToAWS() {
    if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
      throw new Error('AWS credentials not configured');
    }
    
    return {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    };
  }

  async makeApiCall(endpoint: string) {
    if (!API_KEY) {
      throw new Error('API key not configured');
    }
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  }
}

export { AuthService };
export default AuthService;
