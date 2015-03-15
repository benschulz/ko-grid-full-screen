/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define(['ko-grid', 'knockout', 'ko-grid-view-modes', 'ko-data-source', 'ko-indexed-repeat'], factory);
    else
        window['ko-grid-full-screen'] = factory(window.ko.bindingHandlers['grid'], window.ko);
} (function(ko_grid, knockout) {
var ko_grid_full_screen_full_screen, ko_grid_full_screen;

var toolbar = 'ko-grid-toolbar';
var viewModes = 'ko-grid-view-modes';
ko_grid_full_screen_full_screen = function (module, ko, koGrid) {
  var extensionId = 'ko-grid-full-screen'.indexOf('/') < 0 ? 'ko-grid-full-screen' : 'ko-grid-full-screen'.substring(0, 'ko-grid-full-screen'.indexOf('/'));
  var VIEW_MODE_FULL_SCREEN = 'full-screen';
  var document = window.document, html = document.documentElement;
  koGrid.defineExtension(extensionId, {
    dependencies: [
      toolbar,
      viewModes
    ],
    initializer: function (template) {
      template.into('left-toolbar').insert([
        ' <label class="ko-grid-toolbar-button ko-grid-full-screen-label" data-bind="css: { pressed: extensions.fullScreen.__state }">',
        '  <input type="checkbox" tabIndex="-1" class="ko-grid-full-screen-toggle" data-bind="checked: extensions.fullScreen.__state" />',
        '  Full Screen',
        '</label> '
      ].join(''));
    },
    Constructor: function FullScreenExtension(bindingValue, config, grid) {
      var state = ko.observable(false);
      this['__state'] = state;
      this.enter = function () {
        return state(true);
      };
      this.exit = function () {
        return state(false);
      };
      // TODO maybe needs its own extension based on view-modes?
      var fixedHeight = grid.rootElement.classList.contains('fixed-height');
      var stateSubscription = state.subscribe(function (newState) {
        if (newState) {
          html.classList.add('contains-full-screen-element');
          grid.extensions[viewModes].enter(VIEW_MODE_FULL_SCREEN, function () {
            grid.rootElement.classList.add('fixed-height');
          });
        } else {
          html.classList.remove('contains-full-screen-element');
          grid.extensions[viewModes].leave(VIEW_MODE_FULL_SCREEN, function () {
            if (!fixedHeight)
              grid.rootElement.classList.remove('fixed-height');
          });
        }
      });
      this.dispose = function () {
        return stateSubscription.dispose();
      };
    }
  });
  return koGrid.declareExtensionAliases([
    'fullscreen',
    'fullScreen'
  ], extensionId);
}({}, knockout, ko_grid);
ko_grid_full_screen = function (main) {
  return main;
}(ko_grid_full_screen_full_screen);return ko_grid_full_screen;
}));