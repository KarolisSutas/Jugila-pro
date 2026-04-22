import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    appType: 'mpa',
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                apie: resolve(__dirname, 'apie.html'),
                paslaugos: resolve(__dirname, 'paslaugos.html'),
                'paslaugos-zemes-darbai': resolve(__dirname, 'paslaugos-zemes-darbai.html'),
                'paslaugos-inzineriniai-darbai': resolve(__dirname, 'paslaugos-inzineriniai-darbai.html'),
                'paslaugos-sezonines-paslaugos': resolve(__dirname, 'paslaugos-sezonines-paslaugos.html'),
                kontaktai: resolve(__dirname, 'kontaktai.html'),
            },
        },
    },
    plugins: [
        {
            name: 'clean-urls',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.url.startsWith('/paslaugos/')) {
                        const sub = req.url.replace(/\/$/, '').replace('/paslaugos/', 'paslaugos-')
                        req.url = '/' + sub + '.html'
                    } else if (req.url.endsWith('/') && req.url !== '/') {
                        req.url = req.url.slice(0, -1) + '.html'
                    }
                    next()
                })
            },
        },
    ],
})