const fs = require('fs');
const puppeteer = require('puppeteer');

// https://stackoverflow.com/a/48452214
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    //Start sending raw DevTools Protocol commands are sent using `client.send()`
    //First off enable the necessary "Domains" for the DevTools commands we care about
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

    //Start tracking CSS coverage
    await client.send('CSS.startRuleUsageTracking')

    await page.goto(`http://localhost:4000`)

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
