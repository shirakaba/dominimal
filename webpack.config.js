// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { EsbuildPlugin } = require('esbuild-loader');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';
const esbuildOptions = { target: 'es2021' };
const config = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    // new BundleAnalyzerPlugin(),
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  resolve: {
    // See top-level requires in: node_modules/jsdom/lib/api.js
    alias: {
      'decimal.js': false,
      'iconv-lite': false,
      'mime-db': false,
      'tough-cookie': path.resolve(__dirname, './lib/tough-cookie/index.js'),
      'utf-8-validate': false,
      'whatwg-mimetype': path.resolve(
        __dirname,
        './lib/whatwg-mimetype/index.js'
      ),
      'whatwg-url': path.resolve(__dirname, './lib/whatwg-url'),
      bufferutil: false,
      canvas: false,
      // parse5: false, // TODO: consider dropping support (it's big)
      psl: false,
      saxes: false,
      ...[
        'Headers.js', // TODO: use built-in
        'HTMLAnchorElement.js',
        'HTMLAreaElement.js',
        // 'HTMLAudioElement.js',
        'HTMLBaseElement.js',
        'HTMLBRElement.js',
        'HTMLButtonElement.js',
        'HTMLCanvasElement.js',
        'HTMLDataElement.js',
        'HTMLDetailsElement.js',
        'HTMLDialogElement.js',
        'HTMLDirectoryElement.js',
        'HTMLDivElement.js',
        'HTMLDListElement.js',
        'HTMLEmbedElement.js',
        'HTMLFontElement.js',
        'HTMLFormControlsCollection.js',
        'HTMLFormElement.js',
        'HTMLFrameElement.js',
        'HTMLFrameSetElement.js',
        'HTMLHeadingElement.js',
        'HTMLHRElement.js',
        'HTMLIFrameElement.js',
        // 'HTMLImageElement.js',
        'HTMLInputElement.js',
        'HTMLLabelElement.js',
        'HTMLLegendElement.js',
        'HTMLLIElement.js',
        'HTMLLinkElement.js',
        'HTMLMapElement.js',
        'HTMLMarqueeElement.js',
        // 'HTMLMediaElement.js',
        'HTMLMenuElement.js',
        'HTMLMeterElement.js',
        'HTMLModElement.js',
        'HTMLObjectElement.js',
        'HTMLOListElement.js',
        // 'HTMLOptionElement.js',
        'HTMLOptionsCollection.js',
        'HTMLOutputElement.js',
        'HTMLParagraphElement.js',
        'HTMLParamElement.js',
        'HTMLPictureElement.js',
        'HTMLPreElement.js',
        'HTMLProgressElement.js',
        'HTMLQuoteElement.js',
        'HTMLSelectElement.js',
        'HTMLSlotElement.js',
        'HTMLSourceElement.js',
        'HTMLSpanElement.js',
        'HTMLTableCaptionElement.js',
        'HTMLTableCellElement.js',
        'HTMLTableColElement.js',
        'HTMLTableElement.js',
        'HTMLTableRowElement.js',
        'HTMLTableSectionElement.js',
        'HTMLTemplateElement.js',
        'HTMLTextAreaElement.js',
        'HTMLTimeElement.js',
        'HTMLTrackElement.js',
        'HTMLUnknownElement.js',
        'HTMLVideoElement.js',
        // 'MimeTypeArray.js',
        'RadioNodeList.js',
        'SVGAnimatedString.js',
        'SVGElement.js',
        'SVGGraphicsElement.js',
        'SVGNumber.js',
        'SVGStringList.js',
        'SVGSVGElement.js',
        'SVGTitleElement.js',
        'WebSocket.js',
        'XMLHttpRequest.js', // TODO: use built-in
        'XMLHttpRequestUpload.js',
        'XMLHttpRequestEventTarget.js',
      ].reduce((acc, file) => {
        acc[getJsdomSubpath(`lib/jsdom/living/generated/${file}`)] =
          path.resolve(__dirname, './lib/jsdom/living/generated/interface.js');
        return acc;
      }, {}),
      // ...[
      //   'lib/jsdom/living/helpers/form-controls.js',
      //   'lib/jsdom/living/helpers/http-request.js', // TODO: use built-in
      //   'lib/jsdom/living/window/navigation.js',
      // ].reduce((acc, path) => {
      //   acc[getJsdomSubpath(path)] = false;
      //   return acc;
      // }, {}),
      // // lib/jsdom/living/window/SessionHistory.js
      // [getJsdomSubpath('lib/jsdom/living/window/SessionHistory.js')]:
      //   path.resolve(__dirname, './lib/jsdom/living/window/SessionHistory.js'),
      // ...[
      //   'lib/jsdom/living/websockets/WebSocket-impl.js', // TODO: use built-in
      //   'lib/jsdom/living/window/History-impl.js',
      //   'lib/jsdom/living/window/Location-impl.js',
      // ].reduce((acc, subpath) => {
      //   acc[getJsdomSubpath(subpath)] = path.resolve(
      //     __dirname,
      //     './lib/jsdom/impl.js'
      //   );
      //   return acc;
      // }, {}),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: esbuildOptions,
      },

      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  optimization: {
    minimizer: [new EsbuildPlugin(esbuildOptions)],
  },
};

/** @param {string} subpath */
function getJsdomSubpath(subpath) {
  return path.resolve(__dirname, `./node_modules/jsdom/${subpath}`);
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
