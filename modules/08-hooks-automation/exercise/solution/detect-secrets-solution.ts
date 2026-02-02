// detect-secrets.ts - SOLUTION
// Complete hook script for pre-save secret detection

interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

interface DetectionResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  files_checked: number;
  secrets_found: number;
  duration_ms: number;
}

// Cache for performance
const resultCache = new Map<string, DetectionResult>();

/**
 * Main hook function - scans files for secrets before saving
 */
export default async function(
  filePath: string, 
  content: string,
  context: any
): Promise<DetectionResult> {
  console.log(`🔍 Scanning ${filePath} for secrets...`);
  const startTime = Date.now();
  
  // Check cache first for performance
  const contentHash = await getFileHash(content);
  if (resultCache.has(contentHash)) {
    console.log(`  Cache hit! Using cached result`);
    return resultCache.get(contentHash)!;
  }
  
  // Define comprehensive secret patterns
  const secretPatterns: SecretPattern[] = [
    {
      name: 'AWS Access Key ID',
      regex: /AKIA[0-9A-Z]{16}/,
      severity: 'critical',
      description: 'AWS access key found'
    },
    {
      name: 'AWS Secret Access Key',
      regex: /["\']?(aws)?_?(secret)?_?(access)?_?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9/+=]{40}["\']?/i,
      severity: 'critical',
      description: 'AWS secret key found'
    },
    {
      name: 'Private Key',
      regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
      severity: 'critical',
      description: 'Private key found'
    },
    {
      name: 'Password in Code',
      regex: /password\s*[:=]\s*["\'][^"\']{8,}["\']/i,
      severity: 'high',
      description: 'Hardcoded password found'
    },
    {
      name: 'Database Connection String',
      regex: /(postgres|mysql|mongodb)://[^/\s:]+:[^@\s]+@[^/\s]+/i,
      severity: 'high',
      description: 'Database connection string with credentials'
    },
    {
      name: 'API Key',
      regex: /api[_-]?key\s*[:=]\s*["\'][a-zA-Z0-9_-]{16,}["\']/i,
      severity: 'high',
      description: 'API key found'
    },
    {
      name: 'JWT Secret',
      regex: /jwt[_-]?secret\s*[:=]\s*["\'][^"\']{8,}["\']/i,
      severity: 'high',
      description: 'JWT secret found'
    },
    {
      name: 'Stripe Secret Key',
      regex: /sk_live_[a-zA-Z0-9]{24,}/,
      severity: 'critical',
      description: 'Stripe live secret key found'
    },
    {
      name: 'Slack Token',
      regex: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}(-[a-zA-Z0-9]{24})?/,
      severity: 'high',
      description: 'Slack token found'
    },
    {
      name: 'GitHub Token',
      regex: /gh[pousr]_[A-Za-z0-9_]{36,}/,
      severity: 'high',
      description: 'GitHub token found'
    }
  ];
  
  const errors: string[] = [];
  const warnings: string[] = [];
  let secretsFound = 0;
  
  // Check each pattern
  for (const pattern of secretPatterns) {
    const matches = findAllMatches(content, pattern.regex);
    
    for (const match of matches) {
      secretsFound++;
      const lineNumber = getLineNumber(content, match.index);
      
      // Truncate match for display
      const matchDisplay = match.text.length > 20 
        ? match.text.substring(0, 20) + '...'
        : match.text;
      
      const message = `[${pattern.severity.toUpperCase()}] Line ${lineNumber}: ${pattern.description} (${pattern.name}): ${matchDisplay}`;
      
      if (pattern.severity === 'critical') {
        errors.push(message);
      } else {
        warnings.push(message);
      }
    }
  }
  
  // Additional heuristics
  const heuristicWarnings = runHeuristicChecks(content, filePath);
  warnings.push(...heuristicWarnings);
  
  const duration = Date.now() - startTime;
  console.log(`✓ Scan complete in ${duration}ms (${secretsFound} secrets found)`);
  
  const result: DetectionResult = {
    success: errors.length === 0,
    errors,
    warnings,
    files_checked: 1,
    secrets_found: secretsFound,
    duration_ms: duration
  };
  
  // Cache result for performance
  resultCache.set(contentHash, result);
  
  return result;
}

/**
 * Find all matches of a regex in content
 */
function findAllMatches(content: string, regex: RegExp): Array<{text: string, index: number}> {
  const matches = [];
  const globalRegex = new RegExp(regex.source, 'g');
  let match;
  
  while ((match = globalRegex.exec(content)) !== null) {
    matches.push({
      text: match[0],
      index: match.index
    });
  }
  
  return matches;
}

/**
 * Calculate line number from index in content
 */
function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split('\n').length;
}

/**
 * Generate simple hash of content for caching
 */
async function getFileHash(content: string): Promise<string> {
  // Simple hash for demonstration - in production use crypto
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

/**
 * Run additional heuristic checks
 */
function runHeuristicChecks(content: string, filePath: string): string[] {
  const warnings: string[] = [];
  
  // Check for high entropy strings that might be secrets
  const highEntropyPattern = /["\'][a-zA-Z0-9+/=]{32,}["\']/g;
  const entropyMatches = findAllMatches(content, highEntropyPattern);
  
  if (entropyMatches.length > 3) {
    warnings.push(`[INFO] Multiple high-entropy strings detected - manual review recommended`);
  }
  
  // Check for .env files being committed
  if (filePath.includes('.env') && !filePath.includes('.env.example')) {
    warnings.push(`[WARNING] Attempting to save .env file - ensure it's in .gitignore`);
  }
  
  return warnings;
}

// Test if run directly
if (require.main === module) {
  const testContent = `
const apiKey = "AKIAIOSFODNN7EXAMPLE";
const password = "supersecret123";
const dbUrl = "postgres://admin:pass123@localhost:5432/db";
const jwtSecret = 'my-secret-key';
  `;
  
  console.log('Testing secret detection...');
  detectSecrets('test.ts', testContent, {}).then(result => {
    console.log('\nResult:', JSON.stringify(result, null, 2));
  });
}

// Named export for direct usage
export async function detectSecrets(
  filePath: string, 
  content: string, 
  context: any
): Promise<DetectionResult> {
  return export default (filePath, content, context);
}
