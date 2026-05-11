# Ruflo Remote Setup Guide

## Problem
When using `ruflo` remotely, you may encounter:
- `ENOTEMPTY` npm cache errors
- Version mismatch issues  
- **Missing `./claude-flow@alpha` wrapper after init** ⭐ **FIXED!**
- Hook functionality not working

## Quick Fix

### Method 1: One-line Installation
```bash
curl -fsSL https://raw.githubusercontent.com/snowzlm/ruflo/main/install-remote.sh | bash
```

### Method 2: Manual Installation
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm uninstall -g ruflo
npm install -g github:snowzlm/ruflo --no-optional --legacy-peer-deps

# Verify and initialize
ruflo --version
ruflo init
```

### Method 3: Local Development Setup
If you're working with the source code:

```bash
# From the openclaw-flow directory
npm pack
npm install -g ./claude-flow-*.tgz
ruflo --version
```

## Verification

Test that everything works:
```bash
# Check version
ruflo --version

# Test hooks
ruflo hooks notify --message "Setup complete" --level "success"

# Check system status
ruflo status

# ⭐ NEW: Test wrapper creation
ruflo init --force
ls -la ./claude-flow*
# Should show: ./claude-flow@alpha (executable)
./claude-flow@alpha --version
```

## Troubleshooting

### Cache Issues
```bash
npm cache clean --force
rm -rf ~/.npm/_npx
```

### Permission Issues
```bash
sudo npm install -g github:snowzlm/ruflo
# or use nvm to avoid sudo
```

### Binary Not Found
```bash
# Check global bin directory
npm config get prefix
# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"
```

## Remote Usage Tips

1. **Use stable alpha version**: `ruflo@alpha` instead of specific versions
2. **Clear cache first**: Always run `npm cache clean --force` before installation
3. **Use --legacy-peer-deps**: Helps resolve dependency conflicts
4. **Test hooks immediately**: Verify functionality after installation

## Success Indicators

✅ `ruflo --version` shows current version  
✅ `ruflo status` shows system running  
✅ `ruflo hooks notify` works without errors  
✅ All commands available globally