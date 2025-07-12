/**
 * GET request to get song details by id or link.
 * provide either id or link.
 * /api/getSong?id=hvTEqHoh
 * /api/getSong?link=https://www.jiosaavn.com/song/sanam-teri-kasam/GB4-dAV4WFs
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get("id");
    const link = searchParams.get("link");

    if (songId) {
        return getSongById(songId);
    } else if (link) {
        return getSongByLink(link);
    }
}


async function getSongById(songId: string) {
    const params = new URLSearchParams({
        __call: "song.getDetails",
        _format: "json",
        api_version: "4",
        pids: songId,
    });

    const url = `https://www.jiosaavn.com/api.php?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    const data = await response.json();
    const songData = data[songId];
    const { downloadUrl } = await generateDownloadUrl(
        songData.more_info.encrypted_media_url,
        320
    );
    songData.downloadUrl = downloadUrl;
    songData.albumImage = [
        {
            quality: "500x500",
            url: songData.image.replace("150x150", "500x500"),
        },
    ];

    if (response.status !== 200 || !data) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Failed to get song details by id",
            }),
            {
                status: 500,
            }
        );
    }

    return new Response(JSON.stringify(songData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/**
 * Fetches song details from JioSaavn API using the song link.
 * @param {string} link - The song link.
 * @returns {Response} - The song details.
 */
async function getSongByLink(link: string) {
    const token = link.split("/").pop();
    if (!token) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Failed to get song details by link",
            }),
            {
                status: 500,
            }
        );
    }

    const params = new URLSearchParams({
        __call: "webapi.get",
        _format: "json",
        api_version: "4",
        type: "song",
        token: token,
    });

    const url = `https://www.jiosaavn.com/api.php?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    const data = await response.json();
    const songId = Object.keys(data)[0];
    const songData = data[songId];
    const { downloadUrl } = await generateDownloadUrl(
        songData.more_info.encrypted_media_url,
        320
    );
    songData.downloadUrl = downloadUrl;
    songData.albumImage = [
        {
            quality: "500x500",
            url: songData.image.replace("150x150", "500x500"),
        },
    ];

    if (response.status !== 200 || !data) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Failed to get song details by link",
            }),
            {
                status: 500,
            }
        );
    }

    return new Response(JSON.stringify(songData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/**
 * Generates a download URL for a song.
 * @param {string} encrypted_media_url - The encrypted media URL.
 * @param {number} quality - The quality of the song.
 * @returns {Promise<{status: number, message: string, url: string}>} - The download URL.
 */
async function generateDownloadUrl(encrypted_media_url: string, quality: number) {
    const params = new URLSearchParams({
        __call: "song.generateAuthToken",
        _format: "json",
        api_version: "4",
        bitrate: quality.toString(),
        url: encrypted_media_url,
    });
    const url = `https://www.jiosaavn.com/api.php?${params.toString()}`;
    const authResponse = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    const authData = await authResponse.json();

    const response = await fetch(authData.auth_url, {
        redirect: "manual",
    });
    const finalUrl = response.headers.get("location");

    if (authResponse.status !== 200 || !finalUrl) {
        return {
            status: 500,
            message: "Failed to generate download URL",
        };
    }
    return {
        status: 200,
        message: "Success",
        downloadUrl: [
            {
                quality: "320kbps",
                url: finalUrl,
            },
        ],
    };
}
