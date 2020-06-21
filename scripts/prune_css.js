const fs = require('fs');
const puppeteer = require('puppeteer');

// Adapted from https://stackoverflow.com/a/48452214
(async () => {
    const browser = await puppeteer.launch({
        args: [
            '--window-size=1400,1080',
        ],
    });
    const page = await browser.newPage()

    const client = await page.target().createCDPSession()
    await client.send('Page.enable')
    await client.send('DOM.enable')
    await client.send('CSS.enable')

    const inlineStylesheetIndex = new Set();
    client.on('CSS.styleSheetAdded', stylesheet => {
      const { header } = stylesheet
      if (header.isInline || header.sourceURL === '' || header.sourceURL.startsWith('blob:')) {
        inlineStylesheetIndex.add(header.styleSheetId);
      }
    });

    await client.send('CSS.startRuleUsageTracking')

    await page.goto(`http://localhost:4000`)

    // Hit all of the page width breakpoints to capture media styles
    for (let width of [1200, 992, 768, 576, 0]) {
        await page.setViewport({width: width, height: 1080});
    }

    const rules = await client.send('CSS.takeCoverageDelta')
    const usedRules = rules.coverage.filter(rule => {
      return rule.used
    })

    const slices = [];
    for (const usedRule of usedRules) {
      if (inlineStylesheetIndex.has(usedRule.styleSheetId)) {
        continue;
      }

      const stylesheet = await client.send('CSS.getStyleSheetText', {
        styleSheetId: usedRule.styleSheetId
      });

      slices.push(stylesheet.text.slice(usedRule.startOffset, usedRule.endOffset));
    }

    // Read license
    const data = fs.readFileSync('assets/css/bootstrap.min.css', 'utf8');
    const license = data.split('*/', 1)[0] + '*/\n';
    slices.unshift(license);

    // Write to file
    fs.writeFile('assets/css/bootstrap.pruned.min.css', slices.join(''), function (err) {
        if (err) throw err;
    });

    await page.close();
    await browser.close();
})();
