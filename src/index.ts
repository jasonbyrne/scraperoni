import { Scraper } from "./scraper";
import { Article } from "./article";

const scraperoni = (url: string) => {
  return new Scraper(url);
};

export default scraperoni;

export { scraperoni, Article };
