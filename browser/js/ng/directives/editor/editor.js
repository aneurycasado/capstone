'use strict'

app.directive('editor', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/editor/editor.html',
        scope: {
            tower: '=',
            editing: '='
        },
        link: function(scope, element, attrs) {
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.focus();
            editor.goToLine(0);
            scope.saveCodeSnippet = function() {
                scope.tower.codeSnippets.push(editor.getValue());
                console.log(scope.tower);
                scope.editing = false;
            }
        }
    }
});



