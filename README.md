# .NET Ecosystem Review

[**LIVE**](https://tomashubelbauer.github.io/net-ecosystem-review)

![](https://github.com/tomashubelbauer/net-ecosystem-review/workflows/github-pages/badge.svg)

This repository collects a leaderboard of .NET repositories on GitHub with over
1000 stars.

Also check out my JavaScript and TypeScript ecosystem review repositories.

## Running

```sh
# Serve the `data/` route handled by `proxy` in `package.json` of `cra`
cd docs
npx serve .
```

```sh
cd cra
npm start
```

## To-Do

Add left and right arrows for switching to prev and next record.

Use graphical icons instead of + and - signs.

Remember the selected record in local storage and select it unless it was latest
in which case default to latest.

Provide another view with a chart showing stars of each project on a line chart.

Load notes for each item from README.md by parsing it and looking for headers
which match the item name. This way I can keep the notes in prose but also have
them show up in the web app.

Allow favoriting / watching items (probably only locally) to have them appear
highlighted in the leaderboard and in the line chart.

Display another chart which is not total but a change record-to-record.

Calculate the gap to the next item with greater number of stars skipping the
items with which the current one ties.
