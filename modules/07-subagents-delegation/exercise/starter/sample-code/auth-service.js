// Sample Code File 1: User Authentication Service
// This file has security, performance, and testing issues to find

class UserAuthService {
  constructor(db, cache) {
    this.db = db;
    this.cache = cache;
  }

  // Security Issue: SQL Injection vulnerability
  async login(username, password) {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const user = await this.db.query(query);
    
    if (user) {
      // Security Issue: Hardcoded secret
      const token = jwt.sign({ userId: user.id }, 'hardcoded-secret-key-12345');
      return { success: true, token };
    }
    return { success: false };
  }

  // Performance Issue: N+1 query problem
  async getUserWithPosts(userId) {
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const posts = await this.db.query('SELECT * FROM posts WHERE user_id = ?', [userId]);
    
    // Performance Issue: Inefficient nested loop
    for (let post of posts) {
      const comments = await this.db.query('SELECT * FROM comments WHERE post_id = ?', [post.id]);
      post.comments = comments;
    }
    
    user.posts = posts;
    return user;
  }

  // Performance Issue: Sequential awaits in loop
  async processAllUsers() {
    const users = await this.db.query('SELECT id FROM users');
    const results = [];
    
    // This should use Promise.all for parallel processing
    for (let user of users) {
      const result = await this.processUser(user.id);
      results.push(result);
    }
    
    return results;
  }

  // Security Issue: No input validation
  async resetPassword(email, newPassword) {
    // XSS vulnerability - no sanitization
    const html = `<div>Password reset for ${email}</div>`;
    
    await this.db.query("UPDATE users SET password = ? WHERE email = ?", [newPassword, email]);
    return { message: html };
  }

  // Memory Issue: Loading all data into memory
  async exportAllUsers() {
    // Loads entire table into memory - potential OOM
    const allUsers = await this.db.query('SELECT * FROM users');
    return allUsers;
  }

  async processUser(userId) {
    // Mock processing
    return { userId, processed: true };
  }
}

module.exports = UserAuthService;
