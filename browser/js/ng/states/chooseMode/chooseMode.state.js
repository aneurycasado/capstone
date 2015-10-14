app.config(($stateProvider) => {
    $stateProvider
        .state('choose ', {
            url: '/choose',
            templateUrl: '/js/ng/states/chooseMode/chooseMode.state.html',
            resolve: {
                player : (PlayerFactory) => {
                    return PlayerFactory.getGame()
                 }
            },
            controller: 'ChooseModeController'
        })
});

app.controller("ChooseModeController", ($scope,$state, player) => {
    console.log("Player", player);
    document.getElementsByTagName('body')[0].style.backgroundImage="";
    $scope.pickGameType = false;
})