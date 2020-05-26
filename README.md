# Scraperoni

Simple scraping tool to turn web sites into news feeds.

```typescript
import { scraperoni } from "scraperoni";

(async () => {
  const articles = await scraperoni("http://www.seminolecountyfl.gov/")
    .section("events", "#events .article", [
      ["title", "h3"],
      ["summary", "p"],
      ["link", "h3 a@href"],
    ])
    .fetch();
  console.log(articles);
})();
```

The output will look something like:

```javascript
[
  Article {
    section: 'events',
    title: 'WEBEOC USER TRAINING',
    summary: 'May 27, 2020 8:30am  - 10:30am',
    link: 'http://www.seminolecountyfl.gov/WEBEOC%20USER%20TRAINING'
  },
  Article {
    section: 'events',
    title: '[POSTPONED FURTHER] Rolling Hills Pond Restoration',
    summary: 'June 13, 2020 9:00am  - 12:00pm',
    link: 'http://www.seminolecountyfl.gov/[POSTPONED%20FURTHER]%20Rolling%20Hills%20Pond%20Restoration'
  },
  Article {
    section: 'events',
    title: 'G-2300 Intermediate Emergency Operations Center Functions',
    summary: 'June 24, 2020 8:00am  - 5:00pm',
    link: 'http://www.seminolecountyfl.gov/G-2300%20Intermediate%20Emergency%20Operations%20Center%20Functions'
  }
]
```
