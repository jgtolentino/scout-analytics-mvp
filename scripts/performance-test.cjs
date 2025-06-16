#!/usr/bin/env node

/**
 * Performance Testing Script for Scout Dashboard
 * Tests critical user journeys and measures key performance metrics
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.DASHBOARD_URL || 'http://localhost:5173';
const RESULTS_DIR = path.join(process.cwd(), 'performance-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                  new Date().toTimeString().split(' ')[0].replace(/:/g, '');

class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.errors = [];
  }

  async measurePageLoad(page, url, name) {
    console.log(`📊 Testing: ${name}`);
    
    const startTime = Date.now();
    
    // Start monitoring
    const networkRequests = [];
    const consoleErrors = [];
    
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        startTime: Date.now()
      });
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    try {
      // Navigate and wait for network idle
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for React to hydrate
      await page.waitForSelector('[data-testid="dashboard-loaded"], .recharts-wrapper, .grid', { timeout: 10000 });
      
      // Measure key metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          totalLoadTime: Date.now() - navigation.navigationStart
        };
      });

      // Check for critical elements
      const criticalElements = await page.evaluate(() => {
        const checks = {
          hasKPICards: document.querySelectorAll('[data-testid="kpi-card"], .grid > div').length >= 4,
          hasCharts: document.querySelectorAll('.recharts-wrapper, canvas').length >= 2,
          hasNavigation: document.querySelector('nav, .navigation') !== null,
          hasFilters: document.querySelector('[data-testid="global-filters"], input[type="search"]') !== null
        };
        
        return {
          ...checks,
          allCriticalElementsPresent: Object.values(checks).every(Boolean)
        };
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const result = {
        name,
        url,
        timestamp: new Date().toISOString(),
        timing: {
          ...performanceMetrics,
          scriptExecutionTime: totalTime
        },
        elements: criticalElements,
        network: {
          requestCount: networkRequests.length,
          requests: networkRequests.slice(0, 10) // Top 10 for brevity
        },
        errors: consoleErrors,
        success: consoleErrors.length === 0 && criticalElements.allCriticalElementsPresent && totalTime < 10000
      };

      this.metrics.push(result);
      
      console.log(`✅ ${name}: ${totalTime}ms (${result.success ? 'PASS' : 'FAIL'})`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ ${name}: ${error.message}`);
      this.errors.push({ name, error: error.message, url });
      return null;
    }
  }

  async measureUserJourney(page, journey) {
    console.log(`🚀 Testing User Journey: ${journey.name}`);
    
    const journeyStart = Date.now();
    const steps = [];
    
    for (let i = 0; i < journey.steps.length; i++) {
      const step = journey.steps[i];
      const stepStart = Date.now();
      
      try {
        console.log(`   Step ${i + 1}: ${step.description}`);
        
        if (step.action === 'navigate') {
          await page.goto(step.url, { waitUntil: 'networkidle' });
        } else if (step.action === 'click') {
          await page.click(step.selector);
          await page.waitForTimeout(1000); // Wait for UI updates
        } else if (step.action === 'fill') {
          await page.fill(step.selector, step.value);
        } else if (step.action === 'wait') {
          await page.waitForSelector(step.selector, { timeout: 5000 });
        }
        
        const stepEnd = Date.now();
        steps.push({
          ...step,
          duration: stepEnd - stepStart,
          success: true
        });
        
      } catch (error) {
        console.error(`   ❌ Step ${i + 1} failed: ${error.message}`);
        steps.push({
          ...step,
          duration: Date.now() - stepStart,
          success: false,
          error: error.message
        });
        break; // Stop journey on failure
      }
    }
    
    const journeyEnd = Date.now();
    
    const result = {
      name: journey.name,
      totalDuration: journeyEnd - journeyStart,
      steps,
      success: steps.every(step => step.success),
      timestamp: new Date().toISOString()
    };
    
    console.log(`${result.success ? '✅' : '❌'} Journey "${journey.name}": ${result.totalDuration}ms`);
    
    return result;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.metrics.length,
        passed: this.metrics.filter(m => m.success).length,
        failed: this.metrics.filter(m => !m.success).length,
        errors: this.errors.length
      },
      metrics: this.metrics,
      errors: this.errors,
      recommendations: this.generateRecommendations()
    };

    // Save detailed JSON report
    const jsonPath = path.join(RESULTS_DIR, `performance-report-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Save human-readable summary
    const summaryPath = path.join(RESULTS_DIR, `performance-summary-${timestamp}.md`);
    fs.writeFileSync(summaryPath, this.generateMarkdownSummary(report));

    console.log(`\n📊 Performance Report Generated:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   Summary: ${summaryPath}`);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    this.metrics.forEach(metric => {
      if (metric.timing.totalLoadTime > 5000) {
        recommendations.push(`⚠️ ${metric.name}: Load time ${metric.timing.totalLoadTime}ms exceeds 5s threshold`);
      }
      
      if (metric.errors.length > 0) {
        recommendations.push(`🐛 ${metric.name}: ${metric.errors.length} console errors detected`);
      }
      
      if (!metric.elements.allCriticalElementsPresent) {
        recommendations.push(`🎯 ${metric.name}: Missing critical UI elements`);
      }
    });

    return recommendations;
  }

  generateMarkdownSummary(report) {
    return `# Performance Test Report
Generated: ${report.timestamp}

## Summary
- **Total Tests**: ${report.summary.totalTests}
- **Passed**: ${report.summary.passed} ✅
- **Failed**: ${report.summary.failed} ❌
- **Errors**: ${report.summary.errors}

## Test Results
${report.metrics.map(m => `
### ${m.name}
- **Status**: ${m.success ? '✅ PASS' : '❌ FAIL'}
- **Load Time**: ${m.timing.totalLoadTime}ms
- **DOM Content Loaded**: ${m.timing.domContentLoaded}ms
- **First Paint**: ${m.timing.firstPaint}ms
- **Critical Elements**: ${m.elements.allCriticalElementsPresent ? '✅' : '❌'}
- **Console Errors**: ${m.errors.length}
`).join('\n')}

## Recommendations
${report.recommendations.map(r => `- ${r}`).join('\n')}
`;
  }
}

async function runPerformanceTests() {
  console.log('🎯 Starting Performance Tests for Scout Dashboard');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const monitor = new PerformanceMonitor();

  // Test 1: Overview Page Load
  await monitor.measurePageLoad(page, `${BASE_URL}/`, 'Overview Page');

  // Test 2: Transaction Trends
  await monitor.measurePageLoad(page, `${BASE_URL}/transaction-trends`, 'Transaction Trends');

  // Test 3: Product Mix
  await monitor.measurePageLoad(page, `${BASE_URL}/product-mix`, 'Product Mix');

  // Test 4: Consumer Insights
  await monitor.measurePageLoad(page, `${BASE_URL}/consumer-insights`, 'Consumer Insights');

  // Test 5: Filter Interaction Journey
  const filterJourney = {
    name: 'Filter and Navigation',
    steps: [
      { action: 'navigate', url: `${BASE_URL}/`, description: 'Load Overview' },
      { action: 'wait', selector: 'input[type="search"], [data-testid="search-input"]', description: 'Wait for search input' },
      { action: 'fill', selector: 'input[type="search"], [data-testid="search-input"]', value: 'Coca', description: 'Search for Coca' },
      { action: 'click', selector: '[data-testid="kpi-card"]:first-child, .grid > div:first-child', description: 'Click first KPI card' },
      { action: 'wait', selector: '.recharts-wrapper, canvas', description: 'Wait for charts to load' }
    ]
  };

  await monitor.measureUserJourney(page, filterJourney);

  await browser.close();

  // Generate and save report
  const report = monitor.generateReport();
  
  console.log('\n🎉 Performance Testing Complete!');
  
  // Exit with appropriate code
  const hasFailures = report.summary.failed > 0 || report.summary.errors > 0;
  process.exit(hasFailures ? 1 : 0);
}

// Handle CLI execution
if (require.main === module) {
  runPerformanceTests().catch(console.error);
}

module.exports = { runPerformanceTests, PerformanceMonitor };