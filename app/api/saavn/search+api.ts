export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");

    const params = new URLSearchParams({
        p: "1",
        _format: "json",
        api_version: "4",
        __call: "search.getResults",
        n: "20",
        q: query || "", // Add fallback empty string in case query is null
    });
    const url = `https://www.jiosaavn.com/api.php?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    const data = await response.json();

    if (response.status !== 200 || !data) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Failed to fetch data",
            }),
            {
                status: 500,
            }
        );
    }

    return Response.json(data);
}
