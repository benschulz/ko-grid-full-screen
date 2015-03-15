'use strict';

var toolbar = 'ko-grid-toolbar';
var viewModes = 'ko-grid-view-modes';

define(['module', 'knockout', 'ko-grid', toolbar, viewModes], function (module, ko, koGrid) {
    var extensionId = module.id.indexOf('/') < 0 ? module.id : module.id.substring(0, module.id.indexOf('/'));

    var VIEW_MODE_FULL_SCREEN = 'full-screen';

    var document = window.document,
        html = document.documentElement;

    koGrid.defineExtension(extensionId, {
        dependencies: [toolbar, viewModes],
        initializer: template => {
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

            this.enter = () => state(true);
            this.exit = () => state(false);

            // TODO maybe needs its own extension based on view-modes?
            var fixedHeight = grid.rootElement.classList.contains('fixed-height');
            var stateSubscription = state.subscribe(newState => {
                if (newState) {
                    html.classList.add('contains-full-screen-element');
                    grid.extensions[viewModes].enter(VIEW_MODE_FULL_SCREEN, () => {
                        grid.rootElement.classList.add('fixed-height');
                    });
                } else {
                    html.classList.remove('contains-full-screen-element');
                    grid.extensions[viewModes].leave(VIEW_MODE_FULL_SCREEN, () => {
                        if
                        (!fixedHeight) grid.rootElement.classList.remove('fixed-height');
                    });
                }
            });

            this.dispose = () => stateSubscription.dispose();
        }
    });

    return koGrid.declareExtensionAliases(['fullscreen', 'fullScreen'], extensionId);
});
