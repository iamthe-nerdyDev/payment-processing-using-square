import http from 'http';
import createApp from './api';
import Env from './shared/env';
import Logger from './shared/helpers/logger';

(function () {
    try {
        const app = createApp();
        const server = http.createServer(app);
        const port = Env.PORT;
        if (isNaN(port)) throw new Error('PORT specified is not a number!');

        server.listen({ port }, () => Logger.success(`Server is running on port ${Env.PORT}`));
    } catch (e: any) {
        Logger.error('⛔️ Could not spin up server');
        Logger.error(`Error: ${e.message}`);
    }
})();
