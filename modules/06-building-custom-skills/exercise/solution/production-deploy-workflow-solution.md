---
name: production-deploy-workflow
description: Complete production deployment workflow with validation and rollback
context: fork
disable-model-invocation: true
skills: [git-workflow, ci-cd-monitoring, rollback-procedures, health-checks]
model: sonnet
environment:
  NODE_ENV: production
  DEPLOY_TIMEOUT: 600000  # 10 minutes
  HEALTH_CHECK_INTERVAL: 30000  # 30 seconds
monitoring:
  max_execution_time: 1800s  # 30 minutes total
  memory_limit: 1GB
  log_level: info
---

# Production Deployment Workflow

## 🚨 Prerequisites Checklist

### Environment Readiness
- [ ] **Target Environment**: Production is stable and accepting traffic
- [ ] **Backup Status**: Recent backup created and verified
- [ ] **Capacity**: Sufficient server capacity for new version
- [ ] **Monitoring**: All monitoring systems operational
- [ ] **Team Availability**: Key team members on-call and available

### Code Readiness
- [ ] **Tests Passing**: All tests passing in main branch
- [ ] **Code Coverage**: Coverage ≥ 80% maintained
- [ ] **Security Scan**: No high/critical vulnerabilities
- [ ] **Performance Benchmarks**: All benchmarks within thresholds
- [ ] **Dependencies**: All dependencies updated and security-checked

### Approval Status
- [ ] **Technical Review**: Code review completed and approved
- [ ] **Product Review**: Product features validated
- [ ] **Security Review**: Security team approval obtained
- [ ] **Business Approval**: Stakeholder sign-off received
- [ ] **Change Request**: Change request approved in change management system

---

## 📋 Step 1: Pre-Deployment Validation

### 1.1 Automated Checks
```bash
# Validate main branch status
git checkout main
git pull origin main

# Run pre-deploy validation suite
./scripts/pre-deploy-checks.sh
```

**Validation Script Output Expected**:
```
✅ All tests passing (247/247)
✅ Code coverage: 84% (target: 80%)
✅ Security scan: 0 issues
✅ Performance benchmarks: All within limits
✅ Dependency audit: No vulnerable packages
✅ Git status: Clean working directory
```

### 1.2 Manual Verification
```bash
# Verify deployment configuration
cat ./config/production.env | grep -v "SECRET" | grep -v "KEY"

# Check deployment manifest validity
kubectl apply --dry-run=client -f k8s/production/

# Verify database migrations are ready
./scripts/list-pending-migrations.sh
```

### 1.3 Feature Flag Status
```bash
# Check feature flags for new deployment
./scripts/feature-flag-status.sh production

# Expected output:
# 🚦 feature-new-auth: DISABLED (safe to deploy)
# 🚦 performance-upgrade: ENABLED (requires gradual rollout)
# 🚦 beta-analytics: DISABLED (internal testing only)
```

---

## 📦 Step 2: Environment Preparation

### 2.1 Backup Critical Systems
```bash
# Database backup
./scripts/backup-database.sh production

# Configuration backup
kubectl get configmaps -o yaml > backup/configmaps-$(date +%Y%m%d).yaml
kubectl get secrets -o yaml > backup/secrets-$(date +%Y%m%d).yaml

# Current deployment backup
kubectl get deployment -o yaml > backup/deployment-$(date +%Y%m%d).yaml
```

### 2.2 Prepare Rollback Strategy
```bash
# Tag current version for quick rollback
git tag -a "rollback-$(date +%Y%m%d-%H%M%S)" -m "Pre-deployment rollback point"

# Prepare rollback commands
cat > rollback-commands.txt << EOF
git checkout rollback-$(git describe --tags --abbrev=0)
kubectl apply -f k8s/production/
kubectl rollout status deployment/app
EOF
```

### 2.3 Scaling Preparation
```bash
# Scale up for zero-downtime deployment
kubectl patch deployment app -p '{"spec":{"replicas":4}}'

# Wait for additional pods to be ready
kubectl wait --for=condition=ready pod -l app=myapp --timeout=300s
```

---

## 🚀 Step 3: Deployment Execution

### 3.1 Build and Push Images
```bash
# Build new image with proper tagging
IMAGE_TAG="v$(cat package.json | jq -r .version)-$(git rev-parse --short HEAD)"
docker build -t registry.company.com/app:$IMAGE_TAG .

# Push to registry with proper tags
docker push registry.company.com/app:$IMAGE_TAG
docker tag registry.company.com/app:$IMAGE_TAG registry.company.com/app:latest
docker push registry.company.com/app:latest
```

### 3.2 Update Deployment Configuration
```bash
# Update image tag in deployment
sed -i "s|image: registry.company.com/app:.*|image: registry.company.com/app:$IMAGE_TAG|g" k8s/production/deployment.yaml

# Update configuration if needed
if [ -f "config/production-new.env" ]; then
  kubectl create configmap app-config --from-env-file=config/production-new.env -o yaml --dry-run=client | kubectl apply -f -
fi
```

### 3.3 Apply Deployment Changes
```bash
# Deploy with rolling update strategy
kubectl apply -f k8s/production/

# Monitor rollout progress
kubectl rollout status deployment/app --timeout=600s

# Watch for any pod restarts
watch -n 5 "kubectl get pods -l app=myapp --field-selector=status.phase!=Running"
```

---

## 🔍 Step 4: Post-Deployment Validation

### 4.1 Health Checks
```bash
# Application health endpoint
curl -f https://api.company.com/health || echo "❌ Health check failed"

# Database connectivity
./scripts/test-database-connection.sh

# External service integrations
./scripts/test-external-integrations.sh
```

**Expected Health Check Results**:
```
✅ Application health: OK (response time: 120ms)
✅ Database connection: OK (latency: 15ms)
✅ Redis cache: OK (hit rate: 94%)
✅ External API: OK (rate limit: 120/1000)
✅ File storage: OK (99.9% availability)
```

### 4.2 Business Functionality Testing
```bash
# Critical user journeys
./scripts/test-user-journeys.sh production

# Key API endpoints
./scripts/test-api-endpoints.sh

# Performance validation
./scripts/performance-smoke-test.sh
```

### 4.3 Monitoring Verification
```bash
# Check error rates
./scripts/check-error-rates.sh

# Verify performance metrics
./scripts/check-performance-metrics.sh

# Alert system status
./scripts/check-alerting-system.sh
```

**Acceptance Criteria**:
- Error rate < 0.1%
- Response time P95 < 500ms
- No critical alerts triggered
- All health checks passing

---

## 📊 Step 5: Gradual Traffic Management

### 5.1 Initial Traffic Routing (25%)
```bash
# Configure load balancer for gradual rollout
kubectl patch service app -p '{"spec":{"selector":{"version":"new"}}}' --dry-run=client | kubectl apply -f -

# Monitor at 25% traffic for 10 minutes
sleep 600
./scripts/monitor-deployment-health.sh 25
```

### 5.2 Increased Traffic (50%)
```bash
# Scale new version to handle 50% traffic
kubectl patch deployment app -p '{"spec":{"replicas":6}}'

# Monitor for 15 minutes
sleep 900
./scripts/monitor-deployment-health.sh 50
```

### 5.3 Full Traffic Switchover (100%)
```bash
# Route all traffic to new version
kubectl patch service app -p '{"spec":{"selector":{"version":"new"}}}'

# Scale to full production capacity
kubectl patch deployment app -p '{"spec":{"replicas":8}}'

# Final monitoring for 30 minutes
sleep 1800
./scripts/monitor-deployment-health.sh 100
```

---

## 🧹 Step 6: Cleanup and Documentation

### 6.1 Resource Cleanup
```bash
# Remove old image versions (keep last 3)
./scripts/cleanup-old-images.sh

# Remove temporary resources
kubectl delete configmap app-config-temp 2>/dev/null || true

# Scale down to production baseline
kubectl patch deployment app -p '{"spec":{"replicas":4}}'
```

### 6.2 Update Documentation
```bash
# Update deployment log
echo "$(date): Deployed version $IMAGE_TAG to production" >> logs/deployments.log

# Update knowledge base
./scripts/update-deployment-docs.sh $IMAGE_TAG

# Notify team
./scripts/send-deployment-notice.sh "Deployment completed successfully"
```

### 6.3 Post-Deployment Tasks
- [ ] **Create Post-Mortem**: Document lessons learned
- [ ] **Update Playbooks**: Update deployment procedures based on insights
- [ ] **Team Debrief**: Conduct team retrospective
- [ ] **Monitor Trending**: Watch metrics for 24 hours
- [ ] **Feature Flag Review**: Plan gradual feature enablement

---

## 🚨 Rollback Procedures

### Immediate Rollback (< 5 minutes)
```bash
# Quick rollback to previous version
kubectl rollout undo deployment/app

# Verify rollback
kubectl rollout status deployment/app
./scripts/emergency-health-check.sh
```

### Full Rollback to Backup Point
```bash
# Execute prepared rollback commands
bash rollback-commands.txt

# Restore configuration
kubectl apply -f backup/configmaps-$(ls -t backup/configmaps-*.yaml | head -1)

# Validate rollback
./scripts/full-system-validation.sh
```

### Rollback Validation Checklist
- [ ] **Previous Version**: Running and stable
- [ ] **Data Integrity**: No data loss or corruption
- [ ] **User Impact**: Minimal disruption to users
- [ ] **Alerts Cleared**: No lingering error states
- [ ] **Documentation**: Rollback documented for analysis

---

## 📈 Monitoring and Alerting

### Key Metrics to Watch
```yaml
# Application Metrics
error_rate:
  threshold: 0.1%
  window: 5m
  alert: critical

response_time_p95:
  threshold: 500ms
  window: 5m
  alert: warning

throughput:
  threshold: -10% from baseline
  window: 10m
  alert: warning

# Infrastructure Metrics
cpu_usage:
  threshold: 80%
  window: 5m
  alert: warning

memory_usage:
  threshold: 85%
  window: 5m
  alert: warning

disk_usage:
  threshold: 90%
  window: 5m
  alert: critical
```

### Alert Responses
- **Critical Alert**: Immediate rollback consideration
- **Warning Alert**: Investigation within 15 minutes
- **Info Alert**: Log for trend analysis

---

## 🎯 Success Criteria

### Technical Success
- [ ] **Zero Downtime**: No service interruption > 30 seconds
- [ ] **Performance**: Response times within 95th percentile targets
- [ ] **Stability**: Error rates below 0.1% for 2+ hours
- [ ] **Resource Usage**: CPU/Memory within acceptable ranges
- [ ] **Integration**: All external integrations functioning

### Business Success
- [ ] **User Experience**: No user-reported issues
- [ ] **Feature Functionality**: All deployed features working
- [ ] **Data Integrity**: No data loss or corruption
- [ ] **Compliance**: All compliance requirements met
- [ ] **Documentation**: All updates documented

---

## 🔄 Continuous Improvement

### Post-Deployment Analysis
```bash
# Generate deployment report
./scripts/generate-deployment-report.sh $IMAGE_TAG

# Compare with previous deployments
./scripts/deployment-comparison.sh $IMAGE_TAG

# Identify improvement opportunities
./scripts/identify-improvements.sh
```

### Knowledge Updates
- Update deployment playbooks
- Refine automation scripts
- Document edge cases
- Share lessons with team
- Update training materials

---

## 📞 Emergency Contacts

### Primary Response Team
- **DevOps Lead**: [Name] - [Phone] - [Slack]
- **Engineering Manager**: [Name] - [Phone] - [Slack]  
- **Product Owner**: [Name] - [Phone] - [Slack]

### Secondary Support
- **Database Admin**: [Name] - [Phone] - [Slack]
- **Security Team**: [Name] - [Phone] - [Slack]
- **Infrastructure Team**: [Name] - [Phone] - [Slack]

### External Vendors
- **Cloud Provider**: [Support Number]
- **CDN Provider**: [Support Number]
- **Monitoring Service**: [Support Number]

---

## 📝 Deployment Log Template

```markdown
## Deployment: [VERSION] - [DATE/TIME]

### Summary
- **Version**: [IMAGE_TAG]
- **Duration**: [START_TIME] - [END_TIME]
- **Status**: [SUCCESS/PARTIAL/ROLLBACK]
- **Impact**: [ZERO-DOWNTIME/MINOR/MAJOR]

### Key Metrics
- **Test Results**: [PASS/FAIL] ([#] tests)
- **Code Coverage**: [PERCENTAGE]%
- **Security Issues**: [COUNT]
- **Performance**: [P95 response time]

### Issues Encountered
1. [Issue description and resolution]
2. [Issue description and resolution]

### Rollback Status
- **Executed**: [YES/NO]
- **Reason**: [If rolled back]
- **Time to Recovery**: [Duration]

### Lessons Learned
- [What went well]
- [What could be improved]
- [Action items]
```

---

**Deployment Workflow Complete! 🎉** 

Remember: The goal is not just successful deployment, but continuous improvement of the deployment process itself. Document, analyze, and optimize after every deployment.