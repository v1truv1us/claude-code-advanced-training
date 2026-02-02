// auth-service.ts - Sample file with secrets for testing
// This file contains intentional secrets for hook testing

import jwt from 'jsonwebtoken';
import { Database } from './db';

const AWS_ACCESS_KEY = "PLACEHOLDER_AWS_KEY_NOT_REAL";
const AWS_SECRET_KEY = "PLACEHOLDER_AWS_SECRET_NOT_REAL";

const DATABASE_URL = "postgres://admin:PLACEHOLDER_PASSWORD@localhost:5432/myapp";
const API_KEY = "PLACEHOLDER_API_KEY_NOT_REAL";

const JWT_SECRET = 'my-super-secret-jwt-key-12345';

class AuthService {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }

  async login(username: string, password: string) {
    // Vulnerable to SQL injection - for testing
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const user = await this.db.query(query);
    
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
    return {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: 'us-east-1'
    };
  }

  async makeApiCall(endpoint: string) {
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  }
}

export { AuthService, DATABASE_URL };
