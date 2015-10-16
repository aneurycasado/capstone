app.directive('terminal', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/ng/directives/terminal/terminal.html',
        controller: 'TerminalController'
    }
})

app.controller('TerminalController', function($scope, $rootScope, $timeout, TypingFactory) {
    //TypingFactory.write('computer', 'Welcome to td.js');
    function containsSaveError(text){
        console.log('text',text);
        console.log('savePrompt', $('#savePrompt').text());
        if($('#savePrompt').text() === text) return true;
        return false;
    }
    function containsRunTimeError(tower) {
        if($('#runtimePrompt').text().indexOf('RUNTIME ERROR') !== -1) return true;
        //if($('#runtimePrompt').text().indexOf('RUNTIME ERROR') !== -1 && $('#runtimePrompt').text().indexOf(`(${tower.img.x}, ${tower.img.y})`) !== -1) return true;
        return false;
    }
    $rootScope.$on('mapChosen', function() {
            TypingFactory.write('welcomePrompt: welcome to td.js.', 200).write(' prepare to face your fate.', 600)
    })
    $rootScope.$on('saveCodeSuccessful', (event, bool, error) => {
        $('#runtimePrompt').text('');
        if(!bool){
            let text = `savePrompt: SAVE ERROR: ${error.message}`;
            console.log('error', error);
            if(containsSaveError(text.replace('savePrompt:', ''))) return;
            $scope.savePromptColor = {color: 'red'};
            TypingFactory.write(text);
        }
        else {
            $('#savePrompt').text('');
            $scope.savePromptColor = {color: '#86FA70'};
            $('#savePrompt').text('function saved successfully!');
        }
    })
    $rootScope.$on('runtimeError', (event, error, tower) => {
        if(containsRunTimeError(tower)) return;
        TypingFactory.write(`runtimePrompt: RUNTIME ERROR: ${error.message} for tower at (${tower.img.x}, ${tower.img.y})`);
        var colorFilter = new PIXI.filters.ColorMatrixFilter();
        colorFilter.matrix = [
            2,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]
        tower.img.filters = [colorFilter];
    })
    $rootScope.$on('runtimeSuccessful', (event, tower) => {
        tower.img.filters = null;
    })
})
