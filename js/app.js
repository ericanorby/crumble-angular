angular
  .module("crumble", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    RouterFunction
  ])
  .factory("Factory", [
    "$resource",
    FactoryFunction
  ])
  .controller("RecipeIndexController", [
    "$stateParams",
    "$state",
    "Factory",
    RecipeIndexControllerFunction
  ]);

function RouterFunction($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("RecipeIndex", {
      url: "/recipes",
      templateUrl: "/js/ng-views/recipes/index.html",
      controller: "RecipeIndexController",
      controllerAs: "vm"
    });
  $urlRouterProvider.otherwise("/recipes");
}

function FactoryFunction($resource) {
  return {
    recipes: $resource("http://localhost:3000/recipes/:id", {id: "@id"}, {
        update: {method: "PUT"}
    })
  }
}

function RecipeIndexControllerFunction($stateParams, $state, Factory) {
  this.recipes = Factory.recipes.query();
}
