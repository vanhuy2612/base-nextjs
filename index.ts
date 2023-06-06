import Server from '@libs/Server';

(async () => {
    const server = new Server();
    await server.start();
})();
