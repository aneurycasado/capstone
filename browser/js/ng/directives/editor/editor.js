'use strict'

app.directive('editor', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/editor/editor.html',
        link: function(scope, element, attrs) {
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
        }
    }
});



