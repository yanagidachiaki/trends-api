export default async function handler(req, res) {
    try {
        const url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP";

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const text = await response.text();

        const { XMLParser } = await import("fast-xml-parser");
        const parser = new XMLParser();

        const json = parser.parse(text);

        const items = json.rss.channel.item;

        const trends = items.map((item, i) => ({
            rank: i + 1,
            keyword: item.title
        }));

        res.status(200).json(trends);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}