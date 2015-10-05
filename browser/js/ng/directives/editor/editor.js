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
            console.log('hi',scope.tower)
            //scope.tower.editSession = editor;
            editor.focus();
            scope.saveCodeSnippet = function() {
                if(scope.tower) {
                    console.log(scope.tower);
                    if(scope.tower.session === null) scope.tower.session = ace.createEditSession('', 'ace/mode/javascript');
                    scope.tower.session.setValue(editor.getValue())
                    editor.setSession(scope.tower.session);
                }
                scope.tower.codeSnippets = editor.getValue();
                console.log(scope.tower.session);
                scope.editing = false;
            }
        }
    }
});



