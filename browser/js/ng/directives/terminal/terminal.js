app.directive('terminal', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/terminal/terminal.html',
        controller: 'TerminalController'
    }
})

app.controller('TerminalController', function($scope, $rootScope, $timeout, TypingFactory) {
    //TypingFactory.write('computer', 'Welcome to td.js');
    $rootScope.$on('mapChosen', function() {
            TypingFactory.theater
                .write('welcomePrompt: welcome to td.js.', 200).write(' prepare to face your fate.', 600)
    })
    $rootScope.$on('saveCodeSuccessful', function(event, bool, error) {
        if(!bool){
            if($('#savePrompt').text().indexOf('SAVE ERROR') !== -1) return;
            $scope.savePromptColor = {color: 'red'};
            TypingFactory.theater.write('savePrompt: SAVE ERROR: ' + error.message);
        }
        else {
            $('#savePrompt').text('');
            $scope.savePromptColor = {color: 'green'};
            $('#savePrompt').text('function saved successfully!');
        }
    })
})
