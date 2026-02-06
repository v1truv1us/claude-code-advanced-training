# Claude Code Advanced Training

A comprehensive video training series for mastering Claude Code's advanced features: skills, subagents, commands, hooks, and MCP integration.

## 🎯 Target Audience
Development teams already familiar with basic Claude Code setup who want to:
- Master context window management
- Build custom automation workflows
- Implement team-wide standards
- Scale development processes

## 📚 Course Structure

### Prerequisites
- Claude Code installed and configured
- Basic familiarity with command line
- Understanding of software development workflows

### Video Modules (10 videos, ~12 minutes each)

1. **Context Window Mastery** - Optimizing token usage and session management
2. **Verification Strategies** - Test-driven development with Claude
3. **CLAUDE.md Configuration** - Project conventions and persistent context
4. **Plan Mode Workflow** - Explore → Plan → Implement → Commit
5. **Skills Fundamentals** - Reusable knowledge and workflows
6. **Building Custom Skills** - Advanced skill development
7. **Subagents & Delegation** - Isolated context and parallel work
8. **Hooks & Automation** - Deterministic workflows
9. **MCP Integration** - External service connections
10. **Scaling & Parallel Execution** - Headless mode and batch processing

## 🗂️ Repository Layout

```
claude-code-advanced-training/
├── modules/                    # Video content by module
│   ├── 01-context-window-mastery/
│   │   ├── slides.md          # Slide deck outline
│   │   ├── script.md          # Video script
│   │   └── exercise/         # Hands-on exercise
│   └── ...
├── exercises/                  # Additional comprehensive labs
├── resources/                  # Templates and reference materials
│   ├── reading-list.md         # Canonical sources to keep curriculum aligned
│   ├── templates/
│   ├── examples/
│   └── cheat-sheets/
└── solutions/                  # Complete exercise solutions
```

## 🚀 Getting Started

1. **For Training Creators**
   - Clone this repository
   - Customize Module 1-3 for your tech stack
   - Record Module 01 as pilot
   - Gather team feedback before proceeding

2. **For Team Members**
   - Complete prerequisite setup (basic Claude Code)
   - Watch videos in sequence
   - Complete exercises immediately after each video
   - Share solutions for team feedback

## 📖 Module Progression

### Foundation (Modules 1-4)
Focus on core Claude Code capabilities that apply to all workflows:
- Context management principles
- Verification-first development
- Persistent configuration
- Structured planning

### Advanced Features (Modules 5-8)
Build custom automation and team standards:
- Skill development
- Workflow automation
- Context isolation
- Event-driven automation

### Enterprise Scale (Modules 9-10)
Connect to existing infrastructure:
- External service integration
- Parallel processing
- CI/CD integration

## 🎓 Learning Outcomes

After completing this training, developers will be able to:

1. **Context Management**
   - Keep conversations under 5k tokens
   - Use `/clear` and `/compact` effectively
   - Implement context optimization strategies

2. **Verification Development**
   - Write tests before implementation
   - Use visual regression testing
   - Integrate verification into workflow

3. **Configuration Mastery**
   - Write effective CLAUDE.md files
   - Use hierarchical configurations
   - Balance scope vs maintainability

4. **Advanced Automation**
   - Create and deploy skills
   - Set up subagents for specialization
   - Configure hooks for deterministic actions
   - Connect external services via MCP

5. **Team Scaling**
   - Run headless Claude in CI/CD
   - Implement batch processing
   - Manage team permissions and standards

## 🛠️ Prerequisites Setup

Before starting Module 1:

```bash
# Verify Claude Code installation
claude --version

# Create test project for exercises
mkdir claude-training-practice
cd claude-training-practice
git init
echo "# Claude Code Training Practice" > README.md

# Set up basic CLAUDE.md
mkdir .claude
echo "# Project Configuration
pnpm install
pnpm test
pnpm lint
" > .claude/CLAUDE.md
```

## 📊 Time Investment

- **Video Content**: ~2 hours (10 videos × 12 minutes)
- **Hands-on Practice**: ~5 hours (10 exercises × 30 minutes)
- **Total Learning Time**: ~7 hours per developer

## 🔄 Continuous Learning

### Team Capstone Project
After completing all modules, teams should:
1. Identify 3-5 repetitive workflows
2. Build corresponding skills/subagents
3. Create team-wide CLAUDE.md
4. Set up CI/CD integration
5. Share learnings with other teams

### Maintenance Schedule
- **Monthly**: Review and update skills
- **Quarterly**: Audit context usage patterns
- **Semi-annually**: Team training refresh and new features

## 🤝 Contributing

This training curriculum is designed to be:
- **Adaptable**: Customize modules for your tech stack
- **Extensible**: Add new modules as Claude Code evolves
- **Shareable**: Contribute improvements back to community

## 📞 Support

- **Documentation**: [Claude Code Docs](https://code.claude.com/docs/en/overview)
- **Community**: [Claude Discord](https://discord.gg/claude)
- **Issues**: Use GitHub issues for course content feedback

---

**Ready to transform your team's development velocity with Claude Code?** Start with Module 01: Context Window Mastery.