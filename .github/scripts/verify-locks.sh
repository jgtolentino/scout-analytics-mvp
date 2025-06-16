#!/bin/bash
set -euo pipefail

# verify-locks.sh - Verify agent hash locks match current state
# This script ensures no agent files have been modified without updating locks

AGENTS_PATH="packages/agents"
PULSER_RC=".pulserrc"

echo "🔍 Verifying agent locks..."

if [ ! -f "$PULSER_RC" ]; then
    echo "❌ .pulserrc not found"
    exit 1
fi

# Extract agent names from .pulserrc (lines with = that aren't comments)
agents=$(grep -E '^[a-zA-Z_][a-zA-Z0-9_]*=' "$PULSER_RC" | cut -d'=' -f1)

if [ -z "$agents" ]; then
    echo "❌ No agent locks found in $PULSER_RC"
    exit 1
fi

failed=0

for agent in $agents; do
    agent_path="$AGENTS_PATH/$agent"
    
    if [ ! -d "$agent_path" ]; then
        echo "❌ Agent directory not found: $agent_path"
        failed=1
        continue
    fi
    
    # Calculate current hash
    if command -v shasum >/dev/null 2>&1; then
        current_hash=$(find "$agent_path" -type f -exec shasum -a 256 {} \; | sort | shasum -a 256 | cut -d' ' -f1)
    else
        current_hash=$(find "$agent_path" -type f -exec sha256sum {} \; | sort | sha256sum | cut -d' ' -f1)
    fi
    
    # Get expected hash from .pulserrc
    expected_hash=$(grep "^$agent=" "$PULSER_RC" | cut -d'=' -f2)
    
    if [ "$current_hash" = "$expected_hash" ]; then
        echo "✅ $agent: ${current_hash:0:12}..."
    else
        echo "❌ $agent: hash mismatch"
        echo "   Expected: ${expected_hash:0:12}..."
        echo "   Current:  ${current_hash:0:12}..."
        failed=1
    fi
done

if [ $failed -eq 1 ]; then
    echo ""
    echo "💡 Run 'scripts/lock-agent.sh <agent_name>' to update locks"
    exit 1
fi

echo ""
echo "🔐 All agent locks verified successfully"
