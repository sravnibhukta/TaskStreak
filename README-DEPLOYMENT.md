# TaskStreak Deployment Guide

This document provides comprehensive instructions for deploying your TaskStreak application to various production platforms.

## Quick Start (Vercel - Recommended)

### Prerequisites
- Node.js 18+ and npm installed
- Code pushed to GitHub, GitLab, or Bitbucket
- Vercel account

### 1. Create Configuration Files

**vercel.json** (add to project root):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "../dist/public"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
