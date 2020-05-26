# Scraperoni

Simple scraping tool to turn web sites into news feeds.

```typescript
import { scraperoni } from "scraperoni";

(async () => {
  const articles = await scraperoni("http://www.seminolecountyfl.gov/")
    .section("events", "#events .article", [
      ["title", "h3"],
      ["summary", "p"],
      ["link", "h3 a => [href]"],
    ])
    .fetch();
  console.log(articles);
})();
```
