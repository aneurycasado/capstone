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
                if(scope.tower.codeSnippet === null) editor.session.setValue('//Hello and welcome to the code editor. \n//The this within the function has access to the following variables abilities and surroundings. \n//Abilites give you access to your primary weapon, secondary weapon and ultimate. \n//Surroundings give you access to enemies and towers. \n function(){}');
                else {
                    editor.session.setValue(scope.tower.codeSnippet);

                }
            }
            scope.saveCodeSnippet = () => {
                scope.tower.codeSnippet = editor.getValue();
                scope.tower.evalCodeSnippet();
                //let saveSnippet = true;
                //console.log(saveSnippet);

                //scope.$parent.$parent.editing = false;
            }
            scope.goBack = () => {
                $rootScope.$broadcast('setEditing', false);
            }
        }
    }
});



