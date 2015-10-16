app.factory('TypingFactory', function() {
    var theater = new TheaterJS();
    theater
        .describe("welcomePrompt", {speed: 1, accuracy: 1}, '#welcome')
        .describe("savePrompt", {speed: 1, accuracy: 1}, '#savePrompt')
        .describe("runtimePrompt", {speed:1, accuracy: 1}, '#runtimePrompt')
   return theater
});
