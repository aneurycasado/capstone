'use strict'

app.directive('editor', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/editor/editor.html',
        scope: {
            tower: '=',
        },
        link: function(scope, element, attrs) {
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            console.log('hi',scope.tower)
            //scope.tower.editSession = editor;
            editor.focus();
            if(scope.tower) {
                //console.log(scope.tower);
                //if(scope.tower.codeSnippet === null) scope.tower.session = ace.createEditSession('', 'ace/mode/javascript');
                if(scope.tower.codeSnippet === null) editor.session.setValue('');
                else {
                    editor.session.setValue(scope.tower.codeSnippet);
                    //console.log('hey',editor.session.getValue());
                    //editor.setSession(scope.tower.session);
                }
            }
            scope.saveCodeSnippet = function() {
                scope.tower.codeSnippet = editor.getValue();
                //console.log(editor);
                //console.log(scope.tower.session);
                console.log("hi i'm saving");
                console.log('scope', scope);
                scope.$parent.$parent.editing = false;
            }
        }
    }
});



