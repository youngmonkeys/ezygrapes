# GrapesJS Preset Webpage

## Summary

* Plugin name: **`gjs-preset-webpage`**
* Includes:
  * `grapesjs-blocks-basic` Basic set of blocks
  * `grapesjs-navbar` Simple navbar component
  * `grapesjs-component-countdown` Simple countdown component
  * `grapesjs-plugin-forms` Set of form components and blocks
  * `grapesjs-aviary` Add the Aviary Image Editor
  * `grapesjs-plugin-filestack` Add Filestack uploader in Asset Manager
  * `grapesjs-plugin-export` Export GrapesJS templates in a zip archive
* Commands:
  * `gjs-open-import-webpage` Opens a modal for the import
  * `set-device-desktop` Set desktop device
  * `set-device-tablet` Setup tablet device
  * `set-device-mobile` Setup mobile device
  * `canvas-clear` Clear all components and styles inside canvas
* Blocks:
  * `grid sytem`
  * `image`
  * `link`
  * `link-block`
  * `map`
  * `quote`
  * `text`
  * `text-basic`
  * `text-section`
  * `video`

## Options

| Option | Description | Default |
| - | - | - |
| `blocks` | Which blocks to add | `['link-block', 'quote', 'text-basic']` |
| `modalImportLabel` | Import description inside import modal | `''` |
| `modalImportContent` | Default content to setup on import model open. Could also be a function with a dynamic content return (must be a string) eg. `modalImportContent: editor => editor.getHtml()` | `''` |
| `importViewerOptions` | Code viewer (eg. CodeMirror) options | `{}` |
| `showStylesOnChange` | Show the Style Manager on component change | `true` |
| `customStyleManager` | Use custom set of sectors for the Style Manager | `[]` |
| `blocksBasicOpts` | `grapesjs-blocks-basic` plugin options. By setting this option to `false` will avoid loading the plugin | `{}` |
| `navbarOpts` | `grapesjs-navbar` plugin options. By setting this option to `false` will avoid loading the plugin | `{}` |
| `countdownOpts` | `grapesjs-component-countdown` plugin options. By setting this option to `false` will avoid loading the plugin | `{}` |
| `formsOpts` | `grapesjs-plugin-forms` plugin options. By setting this option to `false` will avoid loading the plugin | `{}` |
| `exportOpts` | `grapesjs-plugin-export` plugin options. By setting this option to `false` will avoid loading the plugin | `{}` |
| `aviaryOpts` | `grapesjs-aviary` plugin options. Aviary library should be included manually. By setting this option to `false` will avoid loading the plugin | `false` |
| `filestackOpts` | `grapesjs-plugin-filestack` plugin options. Filestack library should be included manually. By setting this option to `false` will avoid loading the plugin | `false` |

## Download

```sh
$ npm i grapesjs-preset-webpage
```

## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<link href="path/to/grapesjs-preset-webpage.min.css" rel="stylesheet"/>
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-preset-webpage.min.js"></script>

<div id="gjs"></div>

<script defer type="text/javascript">
    document.addEventListener("DOMContentLoaded", function(event) {
        var editor = ezygrapes.init({
            height: '100%',
            showOffsets: 1,
            noticeOnUnload: 0,
            cssIcons: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
            storageManager: {autoload: 0},
            container: '#gjs',
            fromElement: true,

            plugins: ['gjs-preset-webpage'],
            pluginsOpts: {
                'gjs-preset-webpage': {}
            },
            /*i18n: {
                locale: 'vi',
                localeFallback: 'vi',
                detectLocale: false,
            },*/
        });
    });
</script>
```

## Development

Clone the repository

```sh
$ git clone git@github.com:youngmonkeys/ezygrapes.git && cd ezygrapes
```

### Build ezygrapes

1. Install dependencies: `yarn`
2. Build: `yarn build`

### Build the plugin

1. Move to the plugin folder: `cd plugins/preset-webpage`
2. Install dependencies: `yarn`
3. Build: `yarn build`

### Start the dev server

```sh
$ yarn start
```