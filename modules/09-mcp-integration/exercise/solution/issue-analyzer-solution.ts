// issue-analyzer.ts - SOLUTION
// Complete MCP Integration Workflow for GitHub Issue Analysis

interface MCPClient {
  github?: any;
  sqlite?: any;
  slack?: any;
}

interface AnalysisConfig {
  repoOwner: string;
  repoName: string;
  slackChannel: string;
}

interface IssueData {
  id: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels: Array<{ name: string }>;
}

interface AnalysisResult {
  snapshotId: number;
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  labelSummary: Array<{ label: string; count: number; avgAge: number }>;
  highPriorityIssues: IssueData[];
}

// Mock MCP client for demonstration
// In production, this would be actual MCP connections
const mcp: MCPClient = {};

/**
 * Main workflow function
 * Orchestrates GitHub fetch → Analysis → Storage → Slack notification
 */
export default async function analyzeIssues(
  config: AnalysisConfig
): Promise<AnalysisResult> {
  console.log(`🚀 Starting issue analysis for ${config.repoOwner}/${config.repoName}\n`);
  const workflowStart = Date.now();
  const errors: string[] = [];
  
  try {
    // Step 1: Fetch issues from GitHub
    const issues = await fetchGitHubIssues(config.repoOwner, config.repoName);
    
    // Step 2: Analyze issues
    const analysis = analyzeIssueData(issues);
    
    // Step 3: Store results in SQLite
    const snapshotId = await storeResults(analysis, config, issues);
    
    // Step 4: Post summary to Slack
    await postToSlack(analysis, config.slackChannel, snapshotId);
    
    const duration = Date.now() - workflowStart;
    console.log(`\n✅ Analysis complete in ${duration}ms`);
    console.log(`   Snapshot ID: ${snapshotId}`);
    console.log(`   Total Issues: ${analysis.totalIssues}`);
    console.log(`   Open: ${analysis.openIssues} | Closed: ${analysis.closedIssues}`);
    
    return {
      snapshotId,
      ...analysis
    };
    
  } catch (error: any) {
    console.error(`\n❌ Workflow failed: ${error.message}`);
    errors.push(error.message);
    throw error;
  }
}

/**
 * Fetch issues from GitHub using MCP with retry logic
 */
async function fetchGitHubIssues(
  owner: string, 
  repo: string
): Promise<IssueData[]> {
  console.log(`📥 Step 1: Fetching issues from ${owner}/${repo}...`);
  
  return await resilientMcpCall(
    'github',
    'search_issues',
    {
      query: `repo:${owner}/${repo} is:issue`,
      sort: 'updated',
      order: 'desc',
      per_page: 100
    },
    3
  );
}

/**
 * Analyze issue data and calculate metrics
 */
function analyzeIssueData(issues: IssueData[]) {
  console.log(`🔍 Step 2: Analyzing ${issues.length} issues...`);
  
  const now = new Date();
  
  // Basic counts
  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.state === 'open').length;
  const closedIssues = issues.filter(i => i.state === 'closed').length;
  
  // Label analysis
  const labelCounts = new Map<string, { count: number; ages: number[] }>();
  
  issues.forEach(issue => {
    issue.labels.forEach(label => {
      if (!labelCounts.has(label.name)) {
        labelCounts.set(label.name, { count: 0, ages: [] });
      }
      
      const data = labelCounts.get(label.name)!;
      data.count++;
      
      // Calculate age in days
      const created = new Date(issue.created_at);
      const ageDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      data.ages.push(ageDays);
    });
  });
  
  // Build label summary
  const labelSummary = Array.from(labelCounts.entries()).map(([label, data]) => ({
    label,
    count: data.count,
    avgAge: Math.round(data.ages.reduce((a, b) => a + b, 0) / data.ages.length)
  }));
  
  // Sort by count descending
  labelSummary.sort((a, b) => b.count - a.count);
  
  // High priority: open issues older than 30 days with priority labels
  const priorityLabels = ['high-priority', 'critical', 'urgent', 'bug', 'security'];
  const highPriorityIssues = issues.filter(issue => {
    if (issue.state !== 'open') return false;
    
    const created = new Date(issue.created_at);
    const ageDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    const hasPriorityLabel = issue.labels.some(l => 
      priorityLabels.some(pl => l.name.toLowerCase().includes(pl))
    );
    
    return ageDays > 30 || (hasPriorityLabel && ageDays > 14);
  });
  
  return {
    totalIssues,
    openIssues,
    closedIssues,
    labelSummary,
    highPriorityIssues
  };
}

/**
 * Store analysis results in SQLite with error handling
 */
async function storeResults(
  analysis: any, 
  config: AnalysisConfig,
  issues: IssueData[]
): Promise<number> {
  console.log(`💾 Step 3: Storing results in database...`);
  
  try {
    // Create snapshot record
    const snapshotResult = await resilientMcpCall('sqlite', 'execute', {
      sql: `INSERT INTO issue_snapshots 
            (repo_owner, repo_name, total_issues, open_issues, closed_issues)
            VALUES (?, ?, ?, ?, ?)
            RETURNING id`,
      params: [
        config.repoOwner,
        config.repoName,
        analysis.totalIssues,
        analysis.openIssues,
        analysis.closedIssues
      ]
    });
    
    const snapshotId = snapshotResult[0].id;
    
    // Store individual issues
    for (const issue of issues) {
      const priorityScore = calculatePriorityScore(issue);
      const ageDays = Math.floor(
        (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      await resilientMcpCall('sqlite', 'execute', {
        sql: `INSERT INTO issues 
              (snapshot_id, github_issue_id, title, state, created_at, updated_at, closed_at, labels, priority_score, age_days)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          snapshotId,
          issue.id,
          issue.title,
          issue.state,
          issue.created_at,
          issue.updated_at,
          issue.closed_at,
          JSON.stringify(issue.labels.map(l => l.name)),
          priorityScore,
          ageDays
        ]
      });
    }
    
    // Store label summary
    for (const labelData of analysis.labelSummary) {
      await resilientMcpCall('sqlite', 'execute', {
        sql: `INSERT INTO label_summary 
              (snapshot_id, label_name, issue_count, avg_age_days)
              VALUES (?, ?, ?, ?)`,
        params: [snapshotId, labelData.label, labelData.count, labelData.avgAge]
      });
    }
    
    console.log(`   ✓ Created snapshot #${snapshotId} with ${issues.length} issues`);
    return snapshotId;
    
  } catch (error: any) {
    console.error(`   ⚠️  Database storage failed: ${error.message}`);
    console.log(`   📄 Falling back to file-based storage...`);
    
    // Fallback: Store to JSON file
    const fallbackData = {
      timestamp: new Date().toISOString(),
      config,
      analysis,
      issues
    };
    
    // In real implementation: write to file
    console.log(`   ✓ Results saved to fallback storage`);
    
    return -1; // Indicate fallback was used
  }
}

/**
 * Calculate priority score (0-100) for an issue
 */
function calculatePriorityScore(issue: IssueData): number {
  let score = 0;
  
  // Age factor (older = higher priority)
  const ageDays = Math.floor(
    (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  score += Math.min(ageDays / 2, 50);  // Max 50 points for age
  
  // Label factor
  const priorityLabels = ['critical', 'security', 'urgent', 'high-priority'];
  const hasPriorityLabel = issue.labels.some(l => 
    priorityLabels.some(pl => l.name.toLowerCase().includes(pl))
  );
  if (hasPriorityLabel) score += 30;
  
  // Open issues get boost
  if (issue.state === 'open') score += 20;
  
  return Math.min(score, 100);
}

/**
 * Post summary to Slack with error handling
 */
async function postToSlack(
  analysis: any, 
  channel: string,
  snapshotId: number
): Promise<void> {
  console.log(`📤 Step 4: Posting summary to ${channel}...`);
  
  try {
    const summary = formatSlackMessage(analysis, snapshotId);
    
    await resilientMcpCall('slack', 'post_message', {
      channel: channel,
      text: summary,
      unfurl_links: false
    });
    
    console.log(`   ✓ Summary posted to Slack`);
    
  } catch (error: any) {
    console.error(`   ⚠️  Slack notification failed: ${error.message}`);
    console.log(`   📧 Summary would have been sent:`);
    console.log(formatSlackMessage(analysis, snapshotId));
  }
}

/**
 * Format analysis for Slack with rich formatting
 */
function formatSlackMessage(analysis: any, snapshotId: number): string {
  const lines = [
    `📊 *GitHub Issue Analysis Report*`,
    `Snapshot #${snapshotId} | ${new Date().toLocaleDateString()}`,
    ``,
    `*Overview:*`,
    `• Total Issues: ${analysis.totalIssues}`,
    `• Open: ${analysis.openIssues} | Closed: ${analysis.closedIssues}`,
    ``,
    `*Top Labels:*`
  ];
  
  // Add top 5 labels
  analysis.labelSummary.slice(0, 5).forEach((label: any) => {
    lines.push(`• ${label.label}: ${label.count} issues (avg ${label.avgAge} days)`);
  });
  
  // High priority section
  if (analysis.highPriorityIssues.length > 0) {
    lines.push(``,
      `⚠️ *High Priority Issues:* ${analysis.highPriorityIssues.length} items`,
      `Issues older than 30 days or critical bugs`
    );
    
    analysis.highPriorityIssues.slice(0, 3).forEach((issue: IssueData) => {
      const labels = issue.labels.map(l => l.name).join(', ');
      lines.push(`• #${issue.id}: ${issue.title} (${labels})`);
    });
    
    if (analysis.highPriorityIssues.length > 3) {
      lines.push(`• ... and ${analysis.highPriorityIssues.length - 3} more`);
    }
  }
  
  lines.push(``, `_Generated by Claude Code MCP Workflow_`);
  
  return lines.join('\n');
}

/**
 * Resilient MCP call with exponential backoff retry
 */
async function resilientMcpCall(
  server: string,
  tool: string,
  params: any,
  maxRetries: number = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptStart = Date.now();
    
    try {
      // In production: return await mcp[server].callTool(tool, params);
      // For demo: simulate MCP call
      await simulateMcpCall(server, tool, params);
      
      const duration = Date.now() - attemptStart;
      console.log(`     [${server}.${tool}] ✓ Success (${duration}ms)`);
      
      // Return mock data for demonstration
      return generateMockResponse(tool, params);
      
    } catch (error: any) {
      const duration = Date.now() - attemptStart;
      console.error(`     [${server}.${tool}] ✗ Failed (${duration}ms): ${error.message}`);
      
      if (attempt === maxRetries) {
        throw new Error(`${server}.${tool} failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`     Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(delay);
    }
  }
}

/**
 * Simulate MCP call for demonstration
 */
async function simulateMcpCall(server: string, tool: string, params: any): Promise<void> {
  await sleep(100); // Simulate network latency
  
  // Simulate occasional failures for testing retry logic
  if (Math.random() < 0.1) {
    throw new Error('Simulated network error');
  }
}

/**
 * Generate mock responses for demonstration
 */
function generateMockResponse(tool: string, params: any): any {
  if (tool === 'search_issues') {
    return [
      {
        id: 1234,
        title: "Bug: User login fails with 500 error",
        state: "open",
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-15T15:00:00Z",
        closed_at: null,
        labels: [{ name: "bug" }, { name: "high-priority" }]
      },
      {
        id: 1235,
        title: "Feature: Add dark mode",
        state: "open",
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-12T15:00:00Z",
        closed_at: null,
        labels: [{ name: "enhancement" }]
      },
      {
        id: 1236,
        title: "Security: Update dependencies",
        state: "closed",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-08T15:00:00Z",
        closed_at: "2024-01-08T15:00:00Z",
        labels: [{ name: "security" }]
      }
    ];
  }
  
  if (tool === 'execute') {
    return [{ id: Math.floor(Math.random() * 1000) }];
  }
  
  if (tool === 'post_message') {
    return { ok: true };
  }
  
  return {};
}

/**
 * Utility: Sleep for ms
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
if (require.main === module) {
  const config: AnalysisConfig = {
    repoOwner: "facebook",
    repoName: "react",
    slackChannel: "#github-updates"
  };
  
  console.log('='.repeat(70));
  console.log('MCP Integration Workflow: GitHub Issue Analyzer');
  console.log('='.repeat(70) + '\n');
  
  analyzeIssues(config)
    .then(result => {
      console.log('\n' + '='.repeat(70));
      console.log('📊 FINAL RESULTS');
      console.log('='.repeat(70));
      console.log(`Snapshot ID: ${result.snapshotId}`);
      console.log(`Total Issues: ${result.totalIssues}`);
      console.log(`Open: ${result.openIssues} | Closed: ${result.closedIssues}`);
      console.log(`\nLabel Summary:`);
      result.labelSummary.forEach(label => {
        console.log(`  - ${label.label}: ${label.count} issues (${label.avgAge} days avg)`);
      });
      console.log(`\nHigh Priority Issues: ${result.highPriorityIssues.length}`);
    })
    .catch(error => {
      console.error('\n❌ Workflow failed:', error.message);
      process.exit(1);
    });
}

export { analyzeIssues, fetchGitHubIssues, analyzeIssueData, resilientMcpCall };
