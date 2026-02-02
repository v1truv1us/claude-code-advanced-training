# Module 10: Scaling & Parallel Execution

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 10: Scaling & Parallel Execution**
*Headless Operation, Batch Processing, and Organization-Wide Automation*

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Run Claude Code in headless/automated mode
- Design batch processing workflows for large-scale operations
- Implement fan-out patterns for parallel execution
- Integrate with CI/CD pipelines for automated workflows
- Manage resources and quotas at scale
- Build monitoring and observability for scaled operations

### Slide 3: The Scaling Challenge

**When You Need to Scale**
- Processing 1000+ files simultaneously
- Running across multiple repositories
- Automated CI/CD integration
- Overnight batch jobs
- Organization-wide code migrations

**Scaling Dimensions**
```
Scale Vertically          Scale Horizontally
(more power)              (more instances)
    ↓                          ↓
- Larger context           - Parallel sessions
- Faster models            - Distributed work
- More subagents           - Fan-out patterns
```

**Performance Targets**
- 100 files processed in < 5 minutes
- 1000 files processed in < 30 minutes
- Zero manual intervention required
- 99.9% success rate

### Slide 4: Headless Operation Mode

**What is Headless Mode?**
Run Claude Code without interactive UI - perfect for automation, CI/CD, and batch jobs.

**Basic Headless Execution**
```bash
# Execute command without interactive session
claude headless --prompt "Refactor all React class components to hooks" \
                --dir ./src \
                --output ./results.json
```

**Headless with CLAUDE.md**
```bash
# Use project configuration in headless mode
claude headless \
  --config ./CLAUDE.md \
  --prompt "Implement authentication middleware" \
  --files ./src/middleware/ \
  --output-format json
```

**Headless Options**
```bash
claude headless \
  --prompt "Your task description" \\
  --dir ./project              # Working directory \\
  --config ./CLAUDE.md         # Configuration file \\
  --skills ./skills/           # Custom skills to load \\
  --subagents ./subagents/     # Subagent definitions \\
  --output ./results.json      # Output file \\
  --output-format json|md|txt  # Output format \\
  --timeout 300                # Timeout in seconds \\
  --max-cost 10.00             # Maximum cost in dollars \\
  --headless                   # Non-interactive mode
```

### Slide 5: Batch Processing Patterns

**Sequential Batch**
```typescript
// Process files one by one (simple but slow)
async function sequentialBatch(files: string[]) {
  const results = [];
  
  for (const file of files) {
    const result = await claude.headless({
      prompt: `Refactor ${file} to use TypeScript`,
      files: [file]
    });
    results.push(result);
  }
  
  return results;
}
```

**Parallel Batch**
```typescript
// Process files in parallel (much faster)
async function parallelBatch(files: string[], batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(file => claude.headless({
        prompt: `Refactor ${file} to use TypeScript`,
        files: [file]
      }))
    );
    
    results.push(...batchResults);
  }
  
  return results;
}
```

**Chunked Processing**
```typescript
// Process large files in chunks
async function chunkedProcessing(largeFiles: string[]) {
  const chunkSize = 50000; // 50KB chunks
  
  for (const file of largeFiles) {
    const content = await readFile(file);
    const chunks = chunkString(content, chunkSize);
    
    for (let i = 0; i < chunks.length; i++) {
      await claude.headless({
        prompt: `Process chunk ${i + 1}/${chunks.length} of ${file}`,
        content: chunks[i]
      });
    }
  }
}
```

### Slide 6: Fan-Out Architecture

**The Fan-Out Pattern**
```
Master Controller
      ↓
   [Splits work]
      ↓
  ┌───┼───┬───┐
  ↓   ↓   ↓   ↓
Worker1 Worker2 Worker3 Worker4
  ↓   ↓   ↓   ↓
  └───────┼───┘
          ↓
    [Aggregates]
          ↓
   Final Results
```

**Implementation with Subagents**
```typescript
// Fan-out using subagents for isolation
async function fanOutProcessing(tasks: Task[]) {
  const workerCount = 4;
  const taskBatches = chunkArray(tasks, Math.ceil(tasks.length / workerCount));
  
  // Spawn parallel workers
  const workers = taskBatches.map((batch, index) => 
    task({
      description: `Worker ${index + 1}`,
      prompt: `Process ${batch.length} tasks: ${JSON.stringify(batch)}`,
      subagent_type: "batch-worker"
    })
  );
  
  // Aggregate results
  const results = await Promise.all(workers);
  return mergeResults(results);
}
```

**Load Balancing**
```typescript
// Dynamic load balancing based on file sizes
function distributeLoad(files: FileInfo[], workerCount: number): FileInfo[][] {
  // Sort by size (largest first)
  const sorted = [...files].sort((a, b) => b.size - a.size);
  
  // Distribute using round-robin
  const batches: FileInfo[][] = Array.from({ length: workerCount }, () => []);
  let currentBatch = 0;
  
  for (const file of sorted) {
    batches[currentBatch].push(file);
    currentBatch = (currentBatch + 1) % workerCount;
  }
  
  return batches;
}
```

### Slide 7: CI/CD Integration

**GitHub Actions Integration**
```yaml
# .github/workflows/claude-batch.yml
name: Claude Batch Processing

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  workflow_dispatch:
    inputs:
      task:
        description: 'Task to execute'
        required: true
        default: 'refactor'

jobs:
  batch-process:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Claude Code
        uses: anthropic/claude-code-action@v1
        with:
          api-key: ${{ secrets.CLAUDE_API_KEY }}
      
      - name: Run Batch Job
        run: |
          claude headless \
            --prompt "${{ github.event.inputs.task }}" \
            --config ./CLAUDE.md \
            --output ./results/ \
            --timeout 3600
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: claude-results
          path: ./results/
```

**GitLab CI Integration**
```yaml
# .gitlab-ci.yml
claude-batch:
  stage: automation
  image: node:18
  script:
    - npm install -g @anthropic-ai/claude-code
    - |
      claude headless \
        --prompt "Review all files for security vulnerabilities" \
        --config $CLAUDE_CONFIG \
        --output ./security-report.json
  artifacts:
    reports:
      json: security-report.json
  only:
    - schedules
```

**Jenkins Pipeline**
```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Batch Processing') {
            steps {
                script {
                    sh '''
                        claude headless \
                            --prompt "Modernize legacy code" \
                            --dir ./src \
                            --output ./modernization-report.json
                    '''
                }
            }
        }
        
        stage('Report') {
            steps {
                publishHTML([
                    reportDir: './results',
                    reportFiles: 'report.html',
                    reportName: 'Claude Processing Report'
                ])
            }
        }
    }
}
```

### Slide 8: Resource Management

**Cost Control**
```typescript
// Set limits to prevent runaway costs
interface CostLimits {
  maxCostPerJob: number;      // e.g., $10.00
  maxCostPerMonth: number;    // e.g., $500.00
  alertThreshold: number;     // e.g., 80% of budget
}

async function boundedJob(prompt: string, limits: CostLimits) {
  return await claude.headless({
    prompt: prompt,
    maxCost: limits.maxCostPerJob,
    onCostUpdate: (cost: number) => {
      if (cost > limits.maxCostPerJob * 0.8) {
        console.warn(`Cost at 80%: $${cost}/${limits.maxCostPerJob}`);
      }
    }
  });
}
```

**Rate Limiting**
```typescript
// Respect API rate limits
class RateLimiter {
  private queue: Promise<void> = Promise.resolve();
  private lastRequest = 0;
  private minInterval = 100; // ms between requests
  
  async limit<T>(fn: () => Promise<T>): Promise<T> {
    this.queue = this.queue.then(async () => {
      const now = Date.now();
      const wait = Math.max(0, this.lastRequest + this.minInterval - now);
      
      if (wait > 0) {
        await sleep(wait);
      }
      
      this.lastRequest = Date.now();
    });
    
    await this.queue;
    return fn();
  }
}

// Usage
const limiter = new RateLimiter();
const results = await Promise.all(
  files.map(file => limiter.limit(() => processFile(file)))
);
```

**Quota Management**
```yaml
# Quota configuration
quotas:
  requests_per_minute: 60
  tokens_per_hour: 1000000
  concurrent_jobs: 5
  
# Monitor usage
monitoring:
  track_tokens: true
  track_cost: true
  track_latency: true
  alert_on_threshold: 80%
```

### Slide 9: Monitoring & Observability

**Structured Logging**
```typescript
// Log everything in structured format
interface JobLog {
  job_id: string;
  timestamp: string;
  status: 'started' | 'completed' | 'failed';
  duration_ms: number;
  files_processed: number;
  tokens_used: number;
  cost_usd: number;
  errors?: string[];
}

function logJob(log: JobLog) {
  console.log(JSON.stringify(log));
}

// Usage
logJob({
  job_id: 'batch-001',
  timestamp: new Date().toISOString(),
  status: 'completed',
  duration_ms: 45000,
  files_processed: 150,
  tokens_used: 250000,
  cost_usd: 2.50
});
```

**Metrics Collection**
```typescript
// Track key metrics
class MetricsCollector {
  private metrics = {
    jobs_completed: 0,
    jobs_failed: 0,
    total_duration: 0,
    total_cost: 0,
    total_tokens: 0,
    files_processed: 0
  };
  
  recordJob(result: JobResult) {
    this.metrics.jobs_completed++;
    this.metrics.total_duration += result.duration;
    this.metrics.total_cost += result.cost;
    this.metrics.total_tokens += result.tokens;
    this.metrics.files_processed += result.filesCount;
  }
  
  recordFailure(error: Error) {
    this.metrics.jobs_failed++;
    console.error('Job failed:', error);
  }
  
  getSummary() {
    return {
      ...this.metrics,
      avg_duration: this.metrics.total_duration / this.metrics.jobs_completed,
      success_rate: this.metrics.jobs_completed / 
        (this.metrics.jobs_completed + this.metrics.jobs_failed)
    };
  }
}
```

**Dashboard Integration**
```yaml
# Export metrics to monitoring system
monitoring:
  prometheus:
    enabled: true
    endpoint: http://prometheus:9090
    metrics:
      - claude_jobs_total
      - claude_job_duration_seconds
      - claude_job_cost_usd
      - claude_files_processed_total
      
  datadog:
    enabled: true
    api_key: ${DATADOG_API_KEY}
    tags:
      - service:claude-batch
      - environment:production
```

### Slide 10: Error Recovery & Retries

**Checkpoint Pattern**
```typescript
// Save progress periodically for long jobs
class CheckpointManager {
  private checkpoints: Map<string, any> = new Map();
  
  async saveCheckpoint(jobId: string, state: any) {
    const checkpoint = {
      job_id: jobId,
      timestamp: new Date().toISOString(),
      state: state
    };
    
    await writeFile(
      `./checkpoints/${jobId}.json`,
      JSON.stringify(checkpoint, null, 2)
    );
  }
  
  async loadCheckpoint(jobId: string): Promise<any | null> {
    try {
      const data = await readFile(`./checkpoints/${jobId}.json`);
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  async resumeFromCheckpoint(jobId: string) {
    const checkpoint = await this.loadCheckpoint(jobId);
    
    if (checkpoint) {
      console.log(`Resuming job ${jobId} from checkpoint`);
      return checkpoint.state;
    }
    
    return null;
  }
}
```

**Circuit Breaker Pattern**
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailure: Date | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure!.getTime() > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailure = new Date();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

### Slide 11: Performance Optimization

**Smart Batching**
```typescript
// Group related files for better context
function smartBatch(files: FileInfo[]): FileInfo[][] {
  // Group by directory
  const byDir = groupBy(files, f => dirname(f.path));
  
  // Create batches of related files
  return Object.values(byDir).map(dirFiles => {
    // Sort by dependency order
    return sortByDependencies(dirFiles);
  });
}
```

**Caching Strategy**
```typescript
// Cache expensive operations
class ResultCache {
  private cache = new Map<string, CacheEntry>();
  private ttl = 3600000; // 1 hour
  
  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  set(key: string, value: any) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
}
```

**Incremental Processing**
```typescript
// Only process changed files
async function incrementalBatch(allFiles: string[]) {
  const processed = await loadProcessedLog();
  const changedFiles = await getChangedFiles(allFiles);
  
  const filesToProcess = changedFiles.filter(
    file => !processed.has(file)
  );
  
  console.log(`Processing ${filesToProcess.length} of ${allFiles.length} files`);
  
  const results = await parallelBatch(filesToProcess);
  
  // Update processed log
  await saveProcessedLog(new Set([...processed, ...filesToProcess]));
  
  return results;
}
```

### Slide 12: Organization-Wide Patterns

**Repository Discovery**
```typescript
// Automatically discover and process all repos
async function organizationBatch(orgName: string) {
  const repos = await listOrganizationRepos(orgName);
  
  for (const repo of repos) {
    console.log(`Processing ${repo.name}...`);
    
    await claude.headless({
      prompt: "Analyze and document codebase",
      repo: repo.full_name,
      output: `./results/${repo.name}.md`
    });
  }
}
```

**Template-Based Processing**
```typescript
// Apply standard templates across organization
const templates = {
  'README.md': generateReadmeTemplate(),
  'CONTRIBUTING.md': generateContributingTemplate(),
  '.github/workflows/ci.yml': generateCITemplate()
};

async function standardizeRepos(repos: string[]) {
  for (const repo of repos) {
    for (const [file, template] of Object.entries(templates)) {
      await claude.headless({
        prompt: `Ensure ${file} exists and follows template`,
        repo: repo,
        template: template
      });
    }
  }
}
```

### Slide 13: Production Best Practices

**Job Scheduling**
```yaml
# Scheduled jobs configuration
schedule:
  daily-security-scan:
    cron: "0 3 * * *"
    prompt: "Scan all files for security vulnerabilities"
    output: ./reports/security/
    
  weekly-refactor:
    cron: "0 4 * * 0"
    prompt: "Identify and refactor technical debt"
    output: ./reports/refactor/
    
  monthly-documentation:
    cron: "0 5 1 * *"
    prompt: "Update all documentation"
    output: ./reports/docs/
```

**Resource Isolation**
```bash
# Run in isolated environment
claude headless \
  --prompt "Process sensitive data" \
  --sandbox \
  --network-isolated \
  --max-memory 4G \
  --max-cpu 2
```

**Audit Compliance**
```typescript
// Ensure all operations are audited
async function auditedBatch(prompt: string, files: string[]) {
  const auditId = generateAuditId();
  
  auditLog.start({
    audit_id: auditId,
    prompt,
    files,
    timestamp: new Date().toISOString()
  });
  
  try {
    const result = await claude.headless({ prompt, files });
    
    auditLog.success({
      audit_id: auditId,
      result,
      duration: result.duration
    });
    
    return result;
  } catch (error) {
    auditLog.failure({
      audit_id: auditId,
      error: error.message
    });
    throw error;
  }
}
```

### Slide 14: Summary & Key Takeaways

**Scaling Strategies**
1. **Headless Mode** - Non-interactive automation
2. **Parallel Processing** - Fan-out with subagents
3. **Batch Operations** - Process files efficiently
4. **CI/CD Integration** - Automated pipelines
5. **Resource Management** - Cost and quota control

**Performance Targets**
- 100 files in < 5 minutes
- 1000 files in < 30 minutes
- 99.9% success rate
- Full observability

**Production Checklist**
- [ ] Error recovery and retries
- [ ] Cost limits and monitoring
- [ ] Audit logging
- [ ] Checkpoint/save progress
- [ ] Circuit breakers
- [ ] Resource isolation
- [ ] Metrics and alerting

---
*Video Duration: 12 minutes*
