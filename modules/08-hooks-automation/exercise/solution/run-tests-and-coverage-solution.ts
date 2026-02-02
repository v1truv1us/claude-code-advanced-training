// run-tests-and-coverage.ts - SOLUTION
// Complete hook script for pre-commit test execution

interface StageResult {
  name: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  duration_ms: number;
  tests_passed?: number;
  tests_failed?: number;
  coverage_percent?: number;
  suggestions?: string[];
}

interface TestRunResult {
  success: boolean;
  stages: StageResult[];
  total_duration_ms: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

const COVERAGE_THRESHOLD = 80;

/**
 * Main hook function - runs tests and coverage before commits
 */
export default async function(
  commitInfo: any,
  context: any
): Promise<TestRunResult> {
  console.log('🧪 Running pre-commit test suite...\n');
  const startTime = Date.now();
  
  // Run all stages in parallel for performance
  const [lintResult, testResult, coverageResult] = await Promise.all([
    runLintingStage(),
    runTestStage(),
    runCoverageStage()
  ]);
  
  const stages = [lintResult, testResult, coverageResult];
  const failedStages = stages.filter(s => !s.success);
  const totalDuration = Date.now() - startTime;
  
  const allErrors = stages.flatMap(s => s.errors);
  const allWarnings = stages.flatMap(s => s.warnings);
  const allSuggestions = stages.flatMap(s => s.suggestions || []);
  
  console.log(`\n✓ Test suite complete in ${totalDuration}ms`);
  console.log(`  Stages: ${stages.length}, Failed: ${failedStages.length}`);
  console.log(`  Tests: ${testResult.tests_passed} passed, ${testResult.tests_failed} failed`);
  console.log(`  Coverage: ${coverageResult.coverage_percent}%`);
  
  // Print summary
  console.log('\n📊 Results Summary:');
  stages.forEach(stage => {
    const icon = stage.success ? '✓' : '✗';
    console.log(`  ${icon} ${stage.name}: ${stage.success ? 'PASSED' : 'FAILED'} (${stage.duration_ms}ms)`);
  });
  
  return {
    success: failedStages.length === 0,
    stages,
    total_duration_ms: totalDuration,
    errors: allErrors,
    warnings: allWarnings,
    suggestions: allSuggestions
  };
}

/**
 * Stage 1: Run linting
 */
async function runLintingStage(): Promise<StageResult> {
  console.log('  [Stage 1/3] Running linting...');
  const startTime = Date.now();
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Simulate ESLint execution
    // In production: const { execSync } = require('child_process');
    // execSync('npx eslint . --ext .ts,.tsx', { encoding: 'utf8' });
    
    // Mock results for demonstration
    await simulateDelay(800);
    
    // Example findings
    warnings.push('src/index.ts: Unused import "lodash"');
    warnings.push('src/utils.ts: Prefer const over let for unchanged variable');
    
    if (errors.length === 0) {
      suggestions.push('Run: npx eslint --fix . (to auto-fix style issues)');
    }
    
  } catch (error: any) {
    errors.push(`Linting failed: ${error.message}`);
  }
  
  return {
    name: 'lint',
    success: errors.length === 0,
    errors,
    warnings,
    duration_ms: Date.now() - startTime,
    suggestions
  };
}

/**
 * Stage 2: Run tests
 */
async function runTestStage(): Promise<StageResult> {
  console.log('  [Stage 2/3] Running tests...');
  const startTime = Date.now();
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Simulate test execution
    // In production: execSync('npm test', { encoding: 'utf8' });
    await simulateDelay(3000);
    
    // Mock test results
    const testsPassed = 45;
    const testsFailed = 0;
    
    if (testsFailed > 0) {
      errors.push(`${testsFailed} test(s) failed`);
      suggestions.push('Run: npm test -- --verbose (to see detailed failures)');
    }
    
    if (testsPassed === 0) {
      warnings.push('No tests found - consider adding test coverage');
    }
    
    return {
      name: 'test',
      success: errors.length === 0,
      errors,
      warnings,
      duration_ms: Date.now() - startTime,
      tests_passed: testsPassed,
      tests_failed: testsFailed,
      suggestions
    };
    
  } catch (error: any) {
    errors.push(`Test execution failed: ${error.message}`);
    return {
      name: 'test',
      success: false,
      errors,
      warnings,
      duration_ms: Date.now() - startTime,
      tests_passed: 0,
      tests_failed: 0,
      suggestions: ['Check test configuration in package.json']
    };
  }
}

/**
 * Stage 3: Check coverage
 */
async function runCoverageStage(): Promise<StageResult> {
  console.log('  [Stage 3/3] Checking coverage...');
  const startTime = Date.now();
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Simulate coverage report generation
    // In production: execSync('npx jest --coverage', { encoding: 'utf8' });
    await simulateDelay(2500);
    
    // Mock coverage results
    const coveragePercent = 75; // Example: below threshold
    
    if (coveragePercent < COVERAGE_THRESHOLD) {
      errors.push(
        `Coverage ${coveragePercent}% is below ${COVERAGE_THRESHOLD}% threshold`
      );
      suggestions.push('Run: npx jest --coverage (to generate coverage report)');
      suggestions.push('Check coverage/lcov-report/index.html for details');
      suggestions.push('Focus on covering untested critical paths first');
    } else if (coveragePercent < 90) {
      warnings.push(`Coverage ${coveragePercent}% meets threshold but could be improved`);
    }
    
    return {
      name: 'coverage',
      success: errors.length === 0,
      errors,
      warnings,
      duration_ms: Date.now() - startTime,
      coverage_percent: coveragePercent,
      suggestions
    };
    
  } catch (error: any) {
    errors.push(`Coverage check failed: ${error.message}`);
    return {
      name: 'coverage',
      success: false,
      errors,
      warnings,
      duration_ms: Date.now() - startTime,
      suggestions: ['Ensure jest.config.js has coverage enabled']
    };
  }
}

/**
 * Get changed files for selective testing
 */
async function getChangedFiles(): Promise<string[]> {
  try {
    // In production:
    // const { execSync } = require('child_process');
    // const output = execSync('git diff --name-only HEAD', { encoding: 'utf8' });
    // return output.trim().split('\n').filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    
    return ['src/auth.ts', 'src/utils.ts'];
  } catch (error) {
    return [];
  }
}

/**
 * Utility: Simulate async delay
 */
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test if run directly
if (require.main === module) {
  console.log('Testing pre-commit hook...\n');
  
  const mockCommitInfo = {
    message: 'Test commit',
    files: ['src/index.ts', 'src/auth.ts'],
    branch: 'feature/ABC-123-new-auth'
  };
  
  runTestsAndCoverage(mockCommitInfo, {}).then(result => {
    console.log('\n' + '='.repeat(60));
    console.log('Final Result:', result.success ? 'PASSED' : 'FAILED');
    console.log('='.repeat(60));
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(e => console.log(`  - ${e}`));
    }
    
    if (result.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      result.suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    }
  });
}

// Named exports
export { runLintingStage, runTestStage, runCoverageStage };
export async function runTestsAndCoverage(
  commitInfo: any,
  context: any
): Promise<TestRunResult> {
  return export default (commitInfo, context);
}
