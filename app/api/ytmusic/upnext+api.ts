import YTMusic from "ytmusic-api";

export function GET(req: Request) {
    const ytmusic = new YTMusic();
    ytmusic.initialize();
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get("id");
    if (!songId) {
        return new Response("Missing songId parameter", { status: 400 })
    }
    const results = ytmusic.getUpNexts(songId);
    return Response.json({ results });
}