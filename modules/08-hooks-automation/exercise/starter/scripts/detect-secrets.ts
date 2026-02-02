// detect-secrets.ts - STARTER FILE
// Hook script for pre-save secret detection

interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium';
}

interface DetectionResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  files_checked: number;
  secrets_found: number;
}

/**
 * Main hook function
 * Called when files are about to be saved
 */
export default async function(
  filePath: string, 
  content: string,
  context: any
): Promise<DetectionResult> {
  console.log(`🔍 Scanning ${filePath} for secrets...`);
  const startTime = Date.now();
  
  // TODO: Define secret detection patterns
  const secretPatterns: SecretPattern[] = [
    // Example: { name: 'AWS Key', regex: /AKIA.../, severity: 'critical' }
  ];
  
  const errors: string[] = [];
  const warnings: string[] = [];
  let secretsFound = 0;
  
  // TODO: Check content against each pattern
  // HINT: Loop through patterns and test content.match(regex)
  
  // TODO: Get line numbers for matches
  // HINT: Use content.substring(0, match.index).split('\n').length
  
  // TODO: Build error messages with file, line, and pattern name
  // Format: "Line X: [severity] Potential {name} detected"
  
  const duration = Date.now() - startTime;
  console.log(`✓ Scan complete in ${duration}ms (${secretsFound} secrets found)`);
  
  return {
    success: errors.length === 0,
    errors,
    warnings,
    files_checked: 1,
    secrets_found: secretsFound
  };
}

/**
 * TODO: Implement line number calculation
 * Given content and match index, return line number
 */
function getLineNumber(content: string, index: number): number {
  // HINT: Count newlines before the match
  return 1; // Placeholder
}

/**
 * TODO: Implement file hash calculation for caching
 * Optional: Cache results by file hash for performance
 */
async function getFileHash(content: string): Promise<string> {
  // For now, return first 100 chars as simple hash
  return content.substring(0, 100);
}

// Example test
if (require.main === module) {
  const testContent = `
const apiKey = "AKIAIOSFODNN7EXAMPLE";
const password = "supersecret123";
  `;
  
  // Should detect both secrets
  console.log('Testing secret detection...');
  // detectSecrets('test.ts', testContent).then(console.log);
}
