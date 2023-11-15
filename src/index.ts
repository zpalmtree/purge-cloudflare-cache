import axios from 'axios';
import 'dotenv/config';

import { logger } from './Logger.js';

async function main() {
    logger.info(`Purging cloudflare cache...`);

    const zoneId = process.env.ZONE_ID;
    const authKey = process.env.AUTH_KEY;

    if (!zoneId || !authKey) {
        logger.error(`Error, missing zoneId or authKey .env vars!`);
        return;
    }

    await purgeCloudflareCache(zoneId, authKey);

    logger.info(`Done!`);
}

async function purgeCloudflareCache(zoneId: string, authKey: string) {
    try {
        const options = {
            method: 'DELETE',
            url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
            headers: {
                'Authorization': `Bearer ${authKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "purge_everything": true,
            }),
        };

        const response = await axios(options);
        logger.info("Cache cleared successfully", response.status);
    } catch (e: any) {  // Catch & throw the error if something goes wrong
        logger.error("Error: Unable to clear cache", e.message);
    }
}

main();
