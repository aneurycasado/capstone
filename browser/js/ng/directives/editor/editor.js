//Ace editor directive
'use strict'

app.directive('editor', ($rootScope, GameFactory) => {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/editor/editor.html',
        scope: {
            tower: '=',
            //toggleEditing: '&'
        },
        link: (scope, element, attrs) => {
            let editor = ace.edit("editor");
            editor.setTheme("ace/theme/ambiance");
            editor.setOptions({
                fontSize: "14pt"
            });
            editor.getSession().setMode("ace/mode/javascript");
            editor.focus();
            $rootScope.$on('saveCodeSuccessful', function(event, bool, error) {
                if(bool) $rootScope.$broadcast('setEditing', false);
                //else do something with error.message
            });
            scope.saveSnippet = false;
            if(scope.tower) {
                if(scope.tower.codeSnippet === null) editor.session.setValue('function(){//Need help console.log this}');
                else {
                    editor.session.setValue(scope.tower.codeSnippet);
                }
            }
            scope.saveCodeSnippet = () => {
                GameFactory.resume();

                scope.tower.codeSnippet = editor.getValue();
                scope.tower.evalCodeSnippet();
                //let saveSnippet = true;
                //console.log(saveSnippet);

                //scope.$parent.$parent.editing = false;
            }
            scope.goBack = () => {
                GameFactory.resume();
                $rootScope.$broadcast('setEditing', false);
            }
        }
    }
});



