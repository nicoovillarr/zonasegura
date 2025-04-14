export class Utils {
  static toSpanishCamelCase(str: string): string {
    const articles = [
      "de",
      "la",
      "el",
      "los",
      "las",
      "un",
      "una",
      "unos",
      "unas",
      "al",
      "del",
    ];

    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (index !== 0 && articles.includes(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
}
