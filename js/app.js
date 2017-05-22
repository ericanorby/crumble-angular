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
  ])
  .controller("RecipeNewController", [
    "$state",
    "Factory",
    RecipeNewControllerFunction
  ])
  .controller("IngredientShowController", [
    "$stateParams",
    "Factory",
    IngredientShowControllerFunction
  ])
  .directive('stringToNumber', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value, 10);
        });
      }
    }
  });

function RouterFunction($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("RecipeIndex", {
      url: "/recipes",
      templateUrl: "/js/ng-views/recipes/index.html",
      controller: "RecipeIndexController",
      controllerAs: "vm"
    })
    .state("RecipeNew", {
      url: "/recipes/new",
      templateUrl: "/js/ng-views/recipes/new.html",
      controller: "RecipeNewController",
      controllerAs: "vm"
    })
    .state("RecipeShow", {
      url: "/recipes/:id",
      templateUrl: "/js/ng-views/recipes/show.html",
      controller: "RecipeShowController",
      controllerAs: "vm"
    })
    .state("IngredientShow", {
      url: "/recipes/:recipe_id/ingredients/:id",
      templateUrl: "/js/ng-views/ingredients/show.html",
      controller: "IngredientShowController",
      controllerAs: "vm"
    });
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
  var vm = this;
  this.recipe = Factory.recipes.get({id: $stateParams.id}, function(recipe) {
    vm.totalCost = parseFloat(recipe.total_cost).toFixed(2);
    vm.costPerServing = parseFloat(recipe.cost_per_serving).toFixed(2);
  });
  this.ingredients = Factory.ingredients.query({recipe_id: $stateParams.id});
  this.newIngredient = new Factory.ingredients();
  this.create = function() {
    vm.newIngredient.recipe_id = $stateParams.id;
    vm.newIngredient.$save(function() {
      $state.reload()
    });
  }
}

function RecipeNewControllerFunction($state, Factory) {
  this.recipe = new Factory.recipes();
  this.create = function() {
    this.recipe.$save(function(recipe) {
      $state.go('RecipeShow', {
        id: recipe.id
      });
    });
  }
}

function IngredientShowControllerFunction($stateParams, Factory) {
  this.ingredient = Factory.ingredients.get({recipe_id: $stateParams.recipe_id, id: $stateParams.id});
}
