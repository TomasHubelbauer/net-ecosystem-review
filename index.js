const fetch = require('node-fetch');
const fs = require('fs-extra');
const link = require('parse-link-header');

void async function () {
  const stars = 1000;
  let links = { next: { url: `https://api.github.com/search/repositories?q=language:csharp+stars:>${stars}&sort=stars&order=desc` } };
  let text = 'id;name;stars\n';
  while (links.next) {
    console.log('Fetching', links.next.url);
    const response = await fetch(links.next.url, { headers: { Authorization: 'token ' + process.argv[2] } });
    const data = await response.json();
    links = link(response.headers.get('link'));
    for (const item of data.items) {
      text += `${item.id};${item.full_name};${item.stargazers_count}\n`;
    }
  }

  const name = new Date().toISOString().replace(/:/g, '-') + '.csv';
  await fs.ensureDir('docs/data');
  await fs.writeFile('docs/data/' + name, text);
  await fs.appendFile('docs/data/index.log', name + '\n');
}()
