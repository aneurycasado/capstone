//Ace editor directive
'use strict'

app.directive('editor', ($rootScope) => {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/editor/editor.html',
        scope: {
            tower: '=',
            //toggleEditing: '&'
        },
        link: (scope, element, attrs) => {
            let editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.getSession().setMode("ace/mode/javascript");
            editor.focus();
            if(scope.tower) {
                if(scope.tower.codeSnippet === null) editor.session.setValue('function() {}');
                else {
                    editor.session.setValue(scope.tower.codeSnippet);
                }
            }
            scope.saveCodeSnippet = () => {
                scope.tower.codeSnippet = editor.getValue();
                scope.tower.evalCodeSnippet();
                $rootScope.$broadcast('setEditing', false);
                //scope.$parent.$parent.editing = false;
            }
            scope.goBack = () => {
                scope.$parent.$parent.editing = false;
                $rootScope.$broadcast('setEditing', false);
            }
        }
    }
});
