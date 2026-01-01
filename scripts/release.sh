#!/usr/bin/env bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if version argument is provided
if [ -z "$1" ]; then
    print_error "Version type required. Usage: $0 <patch|minor|major|x.y.z>"
    exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major|[0-9]+\.[0-9]+\.[0-9]+)$ ]]; then
    print_error "Invalid version type. Use: patch, minor, major, or a specific version (e.g., 1.2.3)"
    exit 1
fi

# Check if git working directory is clean
if [[ -n $(git status -s) ]]; then
    print_error "Git working directory is not clean. Please commit or stash your changes first."
    git status -s
    exit 1
fi

# Check if on main branch (optional, comment out if you want to release from other branches)
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    print_warning "You are not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run tests
print_info "Running tests..."
npm test

if [ $? -ne 0 ]; then
    print_error "Tests failed. Aborting release."
    exit 1
fi

print_info "Tests passed!"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Bump version
print_info "Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_info "New version: $NEW_VERSION"

# Commit changes
print_info "Committing version bump..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create git tag
print_info "Creating git tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# Publish to npm
print_info "Publishing to npm..."
npm publish

if [ $? -ne 0 ]; then
    print_error "npm publish failed. Rolling back..."
    git tag -d "v$NEW_VERSION"
    git reset --hard HEAD~1
    exit 1
fi

print_info "Successfully published v$NEW_VERSION to npm!"

# Push to git
print_info "Pushing to git..."
git push && git push --tags

if [ $? -ne 0 ]; then
    print_warning "Failed to push to git. Please push manually:"
    print_warning "  git push && git push --tags"
    exit 1
fi

print_info "🎉 Release complete! Version $NEW_VERSION is now published."
print_info "Package: https://www.npmjs.com/package/nvim-mcp-server"
