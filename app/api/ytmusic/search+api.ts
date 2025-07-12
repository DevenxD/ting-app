import YTMusic from "ytmusic-api";

export async function GET(req: Request) {
    const ytmusic = new YTMusic()
    await ytmusic.initialize()
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    if (!query) {
        return new Response("Missing query parameter", { status: 400 })
    }

    let results = null

    switch (type) {
        case "song":
            results = await ytmusic.searchSongs(query);
            break;
        case "album":
            results = await ytmusic.searchAlbums(query);
            break;
        case "artist":
            results = await ytmusic.searchArtists(query);
            break;
        case "playlist":
            results = await ytmusic.searchPlaylists(query);
            break;
        case "video":
            results = await ytmusic.searchVideos(query);
            break;

        default:
            results = await ytmusic.search(query);
            break;
    }

    return Response.json({ results })
}