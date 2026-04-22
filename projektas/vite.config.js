import { defineConfig } from 'vite'

export default defineConfig({
    appType: 'mpa',
    plugins: [
        {
            name: 'clean-urls',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // /paslaugos/zemes-darbai/ → /paslaugos-zemes-darbai.html
                    if (req.url.startsWith('/paslaugos/')) {
                        const sub = req.url.replace(/\/$/, '').replace('/paslaugos/', 'paslaugos-')
                        req.url = '/' + sub + '.html'
                    }
                    // /apie/ → /apie.html
                    else if (req.url.endsWith('/') && req.url !== '/') {
                        req.url = req.url.slice(0, -1) + '.html'
                    }
                    next()
                })
            },
        },
    ],
})