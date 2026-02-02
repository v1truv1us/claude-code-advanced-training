// batch-modernizer.ts - SOLUTION
// Complete scalable batch processing system for code modernization

interface FileInfo {
  path: string;
  size: number;
  lastModified: Date;
}

interface ProcessResult {
  file: string;
  success: boolean;
  changes: string[];
  duration_ms: number;
  cost_usd: number;
  tokens_used: number;
  error?: string;
}

interface BatchConfig {
  sourceDir: string;
  outputDir: string;
  batchSize: number;
  maxWorkers: number;
  costLimit: number;
  checkpointInterval: number;
  timeoutPerFile: number;
}

interface Checkpoint {
  processed: Set<string>;
  failed: Map<string, number>; // file -> retry count
  totalCost: number;
  timestamp: string;
  version: number;
}

// State management
let totalCost = 0;
let processedCount = 0;
let failedCount = 0;
const results: ProcessResult[] = [];

/**
 * Main batch processing function
 * Orchestrates discovery, processing, and reporting
 */
export default async function runBatchModernization(
  config: BatchConfig
): Promise<void> {
  console.log('🚀 Starting batch modernization...\n');
  const workflowStart = Date.now();
  
  // Load checkpoint if exists
  const checkpoint = await loadCheckpoint();
  if (checkpoint) {
    console.log(`📋 Resumed from checkpoint: ${checkpoint.processed.size} files already processed\n`);
    totalCost = checkpoint.totalCost;
  }
  
  // Discover files
  const files = await discoverFiles(config.sourceDir);
  console.log(`📁 Found ${files.length} total files`);
  
  // Filter already processed files
  const filesToProcess = checkpoint 
    ? files.filter(f => !checkpoint.processed.has(f))
    : files;
  
  console.log(`📁 ${filesToProcess.length} files remaining to process\n`);
  
  if (filesToProcess.length === 0) {
    console.log('✅ All files already processed!');
    return;
  }
  
  // Process in batches with parallel workers
  const batches = chunkArray(filesToProcess, config.batchSize);
  console.log(`📦 Processing in ${batches.length} batches (batch size: ${config.batchSize})\n`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Batch ${i + 1}/${batches.length} (${batch.length} files)`);
    console.log('='.repeat(60));
    
    // Check cost limit before processing
    if (totalCost >= config.costLimit) {
      console.error(`\n⚠️  Cost limit reached: $${totalCost.toFixed(2)}/${config.costLimit}`);
      break;
    }
    
    // Process batch with limited concurrency
    await processBatchWithLimit(batch, config);
    
    // Save checkpoint periodically
    if (processedCount % config.checkpointInterval === 0 || i === batches.length - 1) {
      await saveCheckpoint({
        processed: new Set(results.filter(r => r.success).map(r => r.file)),
        failed: new Map(), // Track retry counts
        totalCost,
        timestamp: new Date().toISOString(),
        version: 1
      });
    }
    
    // Progress update
    const progress = ((i + 1) / batches.length * 100).toFixed(1);
    const elapsed = ((Date.now() - workflowStart) / 1000).toFixed(1);
    console.log(`\n📊 Progress: ${progress}% | Processed: ${processedCount} | Cost: $${totalCost.toFixed(2)} | Time: ${elapsed}s`);
  }
  
  // Generate final report
  const totalDuration = Date.now() - workflowStart;
  await generateReport(totalDuration, config);
}

/**
 * Discover JavaScript files recursively
 */
async function discoverFiles(dir: string): Promise<string[]> {
  console.log(`🔍 Scanning ${dir}...`);
  
  try {
    // In production, use proper glob
    // const files = await glob(`${dir}/**/*.js`, { ignore: ['**/node_modules/**', '**/dist/**'] });
    
    // For demonstration, return sample files
    const sampleFiles = [
      `${dir}/legacy-patterns.js`,
      `${dir}/callbacks.js`,
      `${dir}/es5-classes.js`,
      `${dir}/promises.js`,
      `${dir}/var-declarations.js`
    ];
    
    // Add more files to reach 50+ for testing
    for (let i = 0; i < 50; i++) {
      sampleFiles.push(`${dir}/sample-${i}.js`);
    }
    
    return sampleFiles;
  } catch (error: any) {
    console.error(`Error discovering files: ${error.message}`);
    return [];
  }
}

/**
 * Process batch with limited concurrency
 */
async function processBatchWithLimit(
  files: string[],
  config: BatchConfig
): Promise<void> {
  const executing: Promise<void>[] = [];
  const queue = [...files];
  
  // Process with maxWorkers concurrency
  async function processNext(): Promise<void> {
    const file = queue.shift();
    if (!file) return;
    
    const result = await processFileWithRetry(file, config);
    results.push(result);
    
    if (result.success) {
      processedCount++;
      totalCost += result.cost_usd;
    } else {
      failedCount++;
    }
    
    // Process next in queue
    if (queue.length > 0) {
      await processNext();
    }
  }
  
  // Start initial workers
  const workers = Math.min(config.maxWorkers, files.length);
  for (let i = 0; i < workers; i++) {
    executing.push(processNext());
  }
  
  // Wait for all workers to complete
  await Promise.all(executing);
}

/**
 * Process file with retry logic
 */
async function processFileWithRetry(
  file: string,
  config: BatchConfig,
  maxRetries: number = 3
): Promise<ProcessResult> {
  const startTime = Date.now();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  🔄 Processing: ${file} (attempt ${attempt}/${maxRetries})`);
      
      // In production, this would spawn a subagent
      // const result = await task({
      //   description: `Modernize ${file}`,
      //   prompt: `Modernize ${file} to TypeScript/ES6+...`,
      //   subagent_type: "modernization-worker",
      //   timeout: config.timeoutPerFile
      // });
      
      // Simulate processing for demonstration
      await simulateProcessing(file);
      
      const duration = Date.now() - startTime;
      
      return {
        file,
        success: true,
        changes: [
          'Converted callbacks to async/await',
          'Replaced var with const/let',
          'Converted to TypeScript',
          'Added type annotations'
        ],
        duration_ms: duration,
        cost_usd: 0.05 + (Math.random() * 0.03),
        tokens_used: 2500 + Math.floor(Math.random() * 1000)
      };
      
    } catch (error: any) {
      console.error(`  ⚠️  Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        return {
          file,
          success: false,
          changes: [],
          duration_ms: Date.now() - startTime,
          cost_usd: 0,
          tokens_used: 0,
          error: error.message
        };
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt - 1) * 1000;
      await sleep(delay);
    }
  }
  
  // Should never reach here
  return {
    file,
    success: false,
    changes: [],
    duration_ms: Date.now() - startTime,
    cost_usd: 0,
    tokens_used: 0,
    error: 'Max retries exceeded'
  };
}

/**
 * Simulate file processing for demonstration
 */
async function simulateProcessing(file: string): Promise<void> {
  // Simulate variable processing time based on file size
  const delay = 500 + Math.random() * 1500;
  await sleep(delay);
  
  // Simulate occasional failures for testing
  if (Math.random() < 0.05) {
    throw new Error('Simulated processing error');
  }
}

/**
 * Save checkpoint for resume capability
 */
async function saveCheckpoint(state: Checkpoint): Promise<void> {
  try {
    const checkpointData = {
      ...state,
      processed: Array.from(state.processed) // Convert Set to Array for JSON
    };
    
    // In production: await writeFile('./checkpoint.json', JSON.stringify(checkpointData, null, 2));
    console.log(`\n💾 Checkpoint saved: ${state.processed.size} files, $${state.totalCost.toFixed(2)}`);
  } catch (error: any) {
    console.error(`Failed to save checkpoint: ${error.message}`);
  }
}

/**
 * Load checkpoint if exists
 */
async function loadCheckpoint(): Promise<Checkpoint | null> {
  try {
    // In production: const data = await readFile('./checkpoint.json');
    // return JSON.parse(data);
    
    // For demo, return null (start fresh)
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate comprehensive processing report
 */
async function generateReport(
  totalDuration: number,
  config: BatchConfig
): Promise<void> {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  const totalTokens = results.reduce((sum, r) => sum + r.tokens_used, 0);
  const avgDuration = results.length > 0 
    ? results.reduce((sum, r) => sum + r.duration_ms, 0) / results.length 
    : 0;
  
  const report = {
    timestamp: new Date().toISOString(),
    config,
    summary: {
      total_files: results.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: ((successful.length / results.length) * 100).toFixed(1) + '%',
      total_duration_seconds: (totalDuration / 1000).toFixed(1),
      total_cost_usd: totalCost.toFixed(2),
      total_tokens: totalTokens,
      avg_duration_per_file_ms: Math.round(avgDuration)
    },
    successful_files: successful.map(r => ({
      file: r.file,
      changes: r.changes,
      duration_ms: r.duration_ms,
      cost_usd: r.cost_usd
    })),
    failed_files: failed.map(r => ({
      file: r.file,
      error: r.error,
      attempts: 3
    })),
    performance: {
      files_per_second: (results.length / (totalDuration / 1000)).toFixed(2),
      cost_per_file: results.length > 0 ? (totalCost / results.length).toFixed(3) : '0',
      cost_per_1000_tokens: totalTokens > 0 ? ((totalCost / totalTokens) * 1000).toFixed(4) : '0'
    }
  };
  
  // Console output
  console.log('\n' + '='.repeat(70));
  console.log('📊 BATCH PROCESSING REPORT');
  console.log('='.repeat(70));
  console.log(`\nSummary:`);
  console.log(`  Total Files: ${report.summary.total_files}`);
  console.log(`  ✅ Successful: ${report.summary.successful}`);
  console.log(`  ❌ Failed: ${report.summary.failed}`);
  console.log(`  📈 Success Rate: ${report.summary.success_rate}`);
  console.log(`\nResources:`);
  console.log(`  💰 Total Cost: $${report.summary.total_cost_usd} / $${config.costLimit}`);
  console.log(`  📝 Total Tokens: ${report.summary.total_tokens.toLocaleString()}`);
  console.log(`  ⏱️  Total Duration: ${report.summary.total_duration_seconds}s`);
  console.log(`  ⚡ Avg per File: ${report.summary.avg_duration_per_file_ms}ms`);
  console.log(`\nPerformance:`);
  console.log(`  🚀 Files/Second: ${report.performance.files_per_second}`);
  console.log(`  💵 Cost/File: $${report.performance.cost_per_file}`);
  console.log(`  📊 Cost/1K Tokens: $${report.performance.cost_per_1000_tokens}`);
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed Files (${failed.length}):`);
    failed.forEach(f => console.log(`  - ${f.file}: ${f.error}`));
  }
  
  console.log('\n' + '='.repeat(70));
  
  // In production: await writeFile('./report.json', JSON.stringify(report, null, 2));
}

/**
 * Utility: Chunk array into smaller arrays
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Utility: Sleep for ms
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
if (require.main === module) {
  const config: BatchConfig = {
    sourceDir: './starter/legacy-code',
    outputDir: './modernized',
    batchSize: 10,
    maxWorkers: 4,
    costLimit: 25.00,
    checkpointInterval: 20,
    timeoutPerFile: 30000
  };
  
  console.log('='.repeat(70));
  console.log('BATCH CODE MODERNIZATION SYSTEM');
  console.log('='.repeat(70));
  console.log('\nConfiguration:');
  console.log(`  Source: ${config.sourceDir}`);
  console.log(`  Batch Size: ${config.batchSize}`);
  console.log(`  Max Workers: ${config.maxWorkers}`);
  console.log(`  Cost Limit: $${config.costLimit}`);
  console.log(`  Checkpoint Interval: ${config.checkpointInterval} files\n`);
  
  runBatchModernization(config)
    .then(() => {
      console.log('\n✅ Batch processing complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Batch processing failed:', error);
      process.exit(1);
    });
}

export { runBatchModernization, discoverFiles, processFileWithRetry, chunkArray };
