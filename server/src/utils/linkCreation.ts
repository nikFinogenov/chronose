import { google } from "googleapis";
import axios from "axios";

export async function getZoomAccessToken() {
    const clientId = process.env.ZOOM_CLIENT_ID!;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET!;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post(
        "https://zoom.us/oauth/token",
        "grant_type=client_credentials",
        {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data.access_token;
}

export async function getGoogleAccessToken() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", // Файл с ключами OAuth (JSON)
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    return accessToken.token || null;
}
export async function generateGoogleMeetLink(
    eventTitle: string,
    startTime: string,
    endTime: string,
    accessToken: string
): Promise<string | null> {
    try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: "v3", auth });

        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: eventTitle,
                start: { dateTime: startTime, timeZone: "UTC" },
                end: { dateTime: endTime, timeZone: "UTC" },
                conferenceData: {
                    createRequest: { requestId: Math.random().toString(36).substring(2, 15) },
                },
            },
            conferenceDataVersion: 1, // Нужно явно указать версию
        });

        return response.data.conferenceData?.entryPoints?.[0]?.uri || null;
    } catch (error) {
        console.error("Ошибка при создании Google Meet:", error);
        return null;
    }
}
export async function generateZoomLink(
    topic: string,
    startTime: string,
    duration: number,
    jwtToken: string
): Promise<string | null> {
    try {
        const response = await axios.post(
            "https://api.zoom.us/v2/users/me/meetings",
            {
                topic,
                type: 2, // Запланированная встреча
                start_time: startTime,
                duration,
                timezone: "UTC",
                settings: {
                    host_video: true,
                    participant_video: true,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.join_url || null;
    } catch (error) {
        console.error("Ошибка при создании Zoom митинга:", error);
        return null;
    }
}
