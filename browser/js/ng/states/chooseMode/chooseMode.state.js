app.config(function ($stateProvider) {
    $stateProvider
        .state('choose ', {
            url: '/choose',
            templateUrl: '/js/ng/states/chooseMode/chooseMode.state.html',
            // resolve: {
            //     player : function(PlayerFactory){
            //         return PlayerFactory.getGame()
            //     }
            // },
            controller: 'ChooseModeController'
        })
});

app.controller("ChooseModeController", function($scope,$state){
    $scope.goToStoryMode = () => {
        $state.go("play", {"mode": "story"})
    }
    $scope.goToSurvivalMode = () => {
        $state.go("play", {"mode": "survival"})
    }
    $scope.goToDefault = () => {
        $state.go("play", {"mode": "default"})
    }
    $scope.goToDefault = () => {
        $state.go("play", {"mode": "levelEditor"})
    }
})