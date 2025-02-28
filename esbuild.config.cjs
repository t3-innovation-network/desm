const esbuild = require('esbuild');

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';

// Configure esbuild
esbuild
  .context({
    entryPoints: ['app/javascript/application.js'],
    bundle: true,
    sourcemap: !isProduction, // Enable sourcemaps only for development
    minify: isProduction, // Minify for production
    loader: {
      '.js': 'jsx',
      '.jsx': 'jsx',
      '.png': 'file',
      '.svg': 'file',
      '.gif': 'file',
      '.jpg': 'file',
    },
    assetNames: 'images/[name]-[hash].digested', // Images go into a subfolder
    target: 'es6',
    format: 'esm',
    jsx: 'automatic', // Enables React 17+ JSX Transform
    platform: 'browser',
    outdir: 'app/assets/builds',
    publicPath: '/assets',
    logLevel: 'info',
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.ADMIN_ROLE_NAME': JSON.stringify(process.env.ADMIN_ROLE_NAME || 'null'),
      'process.env.MIN_PASSWORD_LENGTH': JSON.stringify(process.env.MIN_PASSWORD_LENGTH || 'null'),
      'process.env.MAPPER_ROLE_NAME': JSON.stringify(process.env.MAPPER_ROLE_NAME || 'null'),
      'process.env.APP_DOMAIN': JSON.stringify(process.env.APP_DOMAIN || 'null'),
    },
    mainFields: ['module', 'main'], // Prioritize ESM over CommonJS
  })
  .then((context) => {
    if (process.argv.includes('--watch')) {
      // Enable watch mode
      context.watch();
    } else {
      // Build once and exit if not in watch mode
      context.rebuild().then((result) => {
        context.dispose();
      });
    }
  })
  .catch(() => process.exit(1));
