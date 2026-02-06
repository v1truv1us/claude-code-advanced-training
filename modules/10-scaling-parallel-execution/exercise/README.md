# Module 10 Exercise: Batch Code Modernization

## 🎯 Objective
Build a scalable batch processing system that modernizes legacy code across multiple files using parallel execution, non-interactive/print mode (`claude -p`), and proper resource management.

## 📋 Prerequisites
- Completed Modules 1-9
- Understanding of parallel processing
- Familiarity with CI/CD concepts

## 🏗️ Exercise Structure

### Part 1: Design Batch Architecture (20 min)
Design a system that:
- Discovers files needing modernization
- Distributes work across parallel workers
- Handles partial failures gracefully
- Tracks progress and reports results

### Part 2: Implement Parallel Processing (30 min)
Create `batch-modernizer.ts` that:
- Scans directory for legacy patterns
- Creates batches of files to process
- Spawns parallel workers via subagents
- Aggregates results and generates report

### Part 3: Add Production Features (20 min)
Implement:
- Cost limits and monitoring
- Error recovery with checkpoints
- Progress tracking and logging
- CI/CD integration template

## 🚀 Success Criteria

### Functional Requirements
✅ Discovers 50+ files in sample directory  
✅ Discovers legacy patterns in the provided sample directory  
✅ Processes files in parallel (4+ concurrent workers)  
✅ Completes batch in under 5 minutes  
✅ Handles failures without stopping entire batch  
✅ Generates detailed processing report  

### Production Quality
✅ Implements cost limiting  
✅ Saves checkpoints for resume capability  
✅ Logs all operations with timestamps  
✅ Includes retry logic for failed files  
✅ Provides CI/CD integration example  

## 📁 Starter Files

See `starter/` directory for:
- `legacy-code/` - Sample legacy JavaScript files to modernize
- `batch-starter.ts` - Partial implementation
- `templates/` - CI/CD integration templates

## 🔧 Implementation Tips

### File Discovery Pattern
```typescript
async function discoverFiles(dir: string): Promise<string[]> {
  const files = await glob(`${dir}/**/*.js`);
  return files.filter(f => !f.includes('node_modules'));
}
```

### Parallel Batching Pattern
```typescript
const batchSize = 10;
for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  await Promise.all(batch.map(f => processFile(f)));
}
```

### Cost Tracking Pattern
```typescript
let totalCost = 0;
const COST_LIMIT = 10.00; // $10

async function boundedProcess(file: string) {
  if (totalCost >= COST_LIMIT) {
    throw new Error('Cost limit exceeded');
  }
  
  const result = await processFile(file);
  totalCost += result.cost;
  return result;
}
```

### Checkpoint Pattern
```typescript
async function saveCheckpoint(progress: any) {
  await writeFile('./checkpoint.json', JSON.stringify(progress));
}

async function loadCheckpoint(): Promise<any | null> {
  try {
    return JSON.parse(await readFile('./checkpoint.json'));
  } catch {
    return null;
  }
}
```

## 🎓 Learning Outcomes

After completing this exercise, you'll understand:
- Batch processing architecture
- Parallel worker patterns
- Resource management and cost control
- Checkpoint/resume strategies
- Production-grade error handling
- CI/CD integration patterns

## 🆘 Common Pitfalls

1. **Memory issues** - Don't load all files at once
2. **No progress tracking** - Save checkpoints regularly
3. **Infinite loops** - Always have termination conditions
4. **Silent failures** - Log every error with context
5. **No cost limits** - Set and enforce budget constraints

## ✅ Checklist

- [ ] Discovers files recursively in directory
- [ ] Identifies legacy patterns in files
- [ ] Creates batches for parallel processing
- [ ] Implements parallel worker execution
- [ ] Tracks processing cost
- [ ] Implements cost limit (e.g., $10)
- [ ] Saves checkpoints every N files
- [ ] Can resume from checkpoint
- [ ] Handles individual file failures
- [ ] Retries failed files (3 attempts)
- [ ] Generates detailed report
- [ ] Logs all operations
- [ ] Includes CI/CD template
- [ ] Completes in under 5 minutes
- [ ] Processes 50+ files successfully

## 📝 Submission

Submit:
1. batch-modernizer.ts implementation
2. Worker subagent configuration
3. Sample processing report
4. CI/CD integration template
5. Performance metrics (time, cost, success rate)

Good luck! 🚀
