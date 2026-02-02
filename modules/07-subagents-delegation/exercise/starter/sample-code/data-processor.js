// Sample Code File 2: Data Processing Module
// Additional file to test your pipeline

const crypto = require('crypto');

class DataProcessor {
  constructor() {
    this.cache = new Map();
  }

  // Performance Issue: O(n²) algorithm
  findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
          duplicates.push(arr[i]);
        }
      }
    }
    return duplicates;
  }

  // Performance Issue: Redundant calculations
  calculateStats(data) {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    
    const variance = data.reduce((sum, x) => {
      return sum + Math.pow(x - mean, 2);  // Recalculating for each item
    }, 0) / data.length;
    
    return { mean, variance, stdDev: Math.sqrt(variance) };
  }

  // Security Issue: Weak randomness
  generateToken() {
    return Math.random().toString(36).substring(2);
  }

  // Security Issue: Timing attack vulnerability
  verifyPassword(input, stored) {
    if (input.length !== stored.length) {
      return false;
    }
    
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== stored[i]) {
        return false;  // Returns early - timing leak
      }
    }
    return true;
  }

  // Memory Issue: Unbounded cache growth
  processWithCache(key, data) {
    if (!this.cache.has(key)) {
      const processed = this.expensiveProcessing(data);
      this.cache.set(key, processed);  // No eviction policy!
    }
    return this.cache.get(key);
  }

  expensiveProcessing(data) {
    // Simulate expensive operation
    return data.map(x => x * 2);
  }

  // Async Issue: Missing error handling
  async fetchData(url) {
    const response = await fetch(url);
    return response.json();  // No error handling
  }

  // Async Issue: Race condition
  async updateCounter() {
    const current = await this.getCurrentValue();
    const newValue = current + 1;
    await this.saveValue(newValue);  // Not atomic - race condition
  }

  async getCurrentValue() {
    return 42; // Mock
  }

  async saveValue(value) {
    // Mock save
  }
}

module.exports = DataProcessor;
