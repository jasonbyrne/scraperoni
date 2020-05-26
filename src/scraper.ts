import bent = require("bent");
import cheerio = require("cheerio");
import { Article } from "./article";

const fetchPage = bent("GET", "string");

const parseSection = ($: CheerioStatic, section: Section) => {
  const articles: Article[] = [];
  $(section.path).each((_index, element) => {
    const article = new Article();
    section.fields.forEach((field) => {
      const value = field.paths
        .map((fieldPath) => {
          const path = fieldPath.split("=>").shift() || "";
          const func = fieldPath.split("=>").pop() || "";
          const attr = func.match(/\[([a-z]+)\]/i);
          let value = attr
            ? $(element).find(path).attr(attr[1])
            : $(element).find(path).text();
          if (field.key == "link" && value) {
            value = new URL(value, section.scraper.baseUrl).href;
          }
          return value;
        })
        .join(field.joiner);
      article["section"] = section.title;
      article[field.key] = value;
    });
    articles.push(article);
  });
  return articles;
};

export type FieldTuple = [FieldKey, string | string[], string?];
export type FieldKey = "title" | "summary" | "link";

export class Field {
  public key: FieldKey;
  public paths: string[];
  public joiner: string;

  constructor(key: FieldKey, paths: string[], joiner: string = " ") {
    this.key = key;
    this.paths = paths;
    this.joiner = joiner;
  }
}

export class Section {
  private _scraper: Scraper;
  private _title: string;
  private _itemPath: string;
  private _fields: { [key: string]: Field } = {};

  public get title(): string {
    return this._title;
  }

  public get scraper(): Scraper {
    return this._scraper;
  }

  public get path(): string {
    return this._itemPath;
  }

  public get fields(): Field[] {
    return Object.values(this._fields);
  }

  constructor(
    scraper: Scraper,
    title: string,
    itemPath: string,
    fields: FieldTuple[]
  ) {
    this._title = title;
    this._scraper = scraper;
    this._itemPath = itemPath;
    fields.forEach((field) => {
      this._addField(field[0], field[1], field[2]);
    });
  }

  private _addField(key: FieldKey, paths: string | string[], joiner?: string) {
    this._fields[key] = new Field(
      key,
      typeof paths == "string" ? [paths] : paths,
      joiner
    );
    return this;
  }

  public section(title: string, path: string, fields: FieldTuple[]) {
    return this._scraper.section(title, path, fields);
  }

  public fetch() {
    return this._scraper.fetch();
  }
}

export class Scraper {
  private _baseUrl: string;
  private _sections: Section[] = [];

  public get baseUrl(): string {
    return this._baseUrl;
  }

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  public section(title: string, path: string, fields: FieldTuple[]) {
    const section = new Section(this, title, path, fields);
    this._sections.push(section);
    return section;
  }

  public async fetch(): Promise<Article[]> {
    const content = await fetchPage(this._baseUrl);
    const $ = cheerio.load(content);
    const sections = this._sections.map((section) => parseSection($, section));
    return sections.reduce((sections, val) => sections.concat(val), []);
  }
}
