#!/bin/bash

echo "🚀 Installing UI/UX Enhancement Packages for loopInt Dashboard..."

# Navigate to web app directory
cd apps/web

echo "📦 Installing Phase 1 packages (High Impact, Low Effort)..."
npm install react-hot-toast react-hook-form @hookform/resolvers zod fuse.js

echo "📦 Installing Phase 2 packages (Medium Impact, Medium Effort)..."
npm install @tanstack/react-virtual react-intersection-observer react-use

echo "📦 Installing Phase 3 packages (High Impact, High Effort)..."
npm install react-dnd react-dnd-html5-backend cmdk @react-spring/web

echo "📦 Installing additional utility packages..."
npm install clsx class-variance-authority

echo "✅ All packages installed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Import and configure react-hot-toast in your App.tsx"
echo "2. Set up command palette with cmdk"
echo "3. Add drag & drop functionality with react-dnd"
echo "4. Implement search with fuse.js"
echo ""
echo "📚 Check PACKAGES_RECOMMENDATIONS.md for implementation guides"