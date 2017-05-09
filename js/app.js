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
  ])
  .controller("RecipeShowController", [
    "$stateParams",
    "$state",
    "Factory",
    RecipeShowControllerFunction
  ]);

function RouterFunction($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("RecipeIndex", {
      url: "/recipes",
      templateUrl: "/js/ng-views/recipes/index.html",
      controller: "RecipeIndexController",
      controllerAs: "vm"
    })
    .state("RecipeShow", {
      url: "/recipes/:id",
      templateUrl: "/js/ng-views/recipes/show.html",
      controller: "RecipeShowController",
      controllerAs: "vm"
    })
  $urlRouterProvider.otherwise("/recipes");
}

function FactoryFunction($resource) {
  return {
    recipes: $resource("http://localhost:3000/recipes/:id", {id: "@id"}, {
      update: {method: "PUT"}
    }),
    ingredients: $resource("http://localhost:3000/recipes/:recipe_id/ingredients/:id", {recipe_id: "@recipe_id", id: "@id"}, {
      update: {method: "PUT"}
    })
  }
}

function RecipeIndexControllerFunction($stateParams, $state, Factory) {
  this.recipes = Factory.recipes.query();
}

function RecipeShowControllerFunction($stateParams, $state, Factory) {
  this.recipe = Factory.recipes.get({id: $stateParams.id});
  this.ingredients = Factory.ingredients.query({recipe_id: $stateParams.id})
}
