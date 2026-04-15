export default async function handler(req, res) {
    try {
        const url = "https://trends.google.com/trending/rss?geo=JP";

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const text = await response.text();

        const { XMLParser } = await import("fast-xml-parser");
        const parser = new XMLParser();

        const json = parser.parse(text);

        // 安全チェック
        if (!json?.rss?.channel?.item) {
            return res.status(500).json({ error: "データ取得失敗（構造不正）" });
        }

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