const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    minify: true,
    outfile: 'public/bundle.js',
    format: 'iife',
    globalName: 'App',

    // 🔥 KRITISK FIX
    alias: {
        'three': require('path').resolve(__dirname, 'libs/three.module.js'),
    },

}).catch(() => process.exit(1));