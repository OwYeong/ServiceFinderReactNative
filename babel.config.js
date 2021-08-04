module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
  	// ... some other plugins
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@atoms': './src/components/atoms',
          '@molecules': './src/components/molecules',
          '@organisms': './src/components/organisms',
          '@navigations': './src/navigations',
          '@pages': './src/pages',
          '@services': './src/services',
          '@styles': './src/styles',
          '@utils': './src/utils',
          /**
           * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
           */
           '^~(.+)': './src/\\1',// use ~ symbol to refer from source in import statement
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.json',
          '.tsx',
          '.ts',
          '.native.js',
          '.svg'
        ],
      },
    ],
  ],
};
