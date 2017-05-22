// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var todoApp = angular.module('todoApp', ['ionic']);

todoApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

todoApp.controller('TodoController', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicPopup) {  
  
    // A utility function for creating a new project  
    // with the given projectTitle  
    var createProject = function (projectTitle) {  
        var newProject = Projects.newProject(projectTitle);  
        $scope.projects.push(newProject);  
        Projects.save($scope.projects);  
        $scope.selectProject(newProject, $scope.projects.length - 1);  
    }  
  
  
    // Load or initialize projects  
    $scope.projects = Projects.all();  
  
    // Grab the last active, or the first project  
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];  
  
    // Called to create a new project  
    $scope.newProject = function () {  
        var projectTitle = prompt('Project name');  
        if (projectTitle) {  
            createProject(projectTitle);  
        }  
    };  
  
    // Called to select the given project  
    $scope.selectProject = function (project, index) {  
        $scope.activeProject = project;  
        Projects.setLastActiveIndex(index);  
        $ionicSideMenuDelegate.toggleLeft(false);  
    };  
  
    // Create our modal  
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {  
        $scope.taskModal = modal;  
    }, {  
        scope: $scope  
    });  
  
    $scope.createTask = function (task) {  
        if (!$scope.activeProject || !task) {  
            return;  
        }  
        $scope.activeProject.tasks.push({  
            title: task.title  
        });  
        $scope.taskModal.hide();  
  
        // Inefficient, but save all the projects  
        Projects.save($scope.projects);  
  
        task.title = "";  
    };  
  
    $scope.newTask = function () {  
        $scope.taskModal.show();  
    };  
  
    $scope.closeNewTask = function () {  
        $scope.taskModal.hide();  
    };  
  
    $scope.toggleProjects = function () {  
        $ionicSideMenuDelegate.toggleLeft();  
    };
    // remove an element
    $scope.removeTask = function (index, deleteTask) {
        if (deleteTask) {
            var result = confirm("Are you sure you want to delete this task?");
        }
        if (!deleteTask || result) {
            $scope.activeProject.tasks.splice(index,1);
            Projects.save($scope.projects);
            var note = '';
            if (deleteTask) {
                note = 'Task deleted';
            } else {
                note = 'Task finished';
            }
            var removalPopup = $ionicPopup.show({
                title: note
            });

            $timeout(function() {
                removalPopup.close();
            }, 1000);       
        }

    };  
    // Try to create the first project, make sure to defer  
    // this by using $timeout so everything is initialized  
    // properly  
    $timeout(function () {  
        if ($scope.projects.length == 0) {  
            while (true) {  
                var projectTitle = prompt('Your first project title:');  
                if (projectTitle) {  
                    createProject(projectTitle);  
                    break;  
                }  
            }  
        }  
    });  
  
});  
  
  
todoApp.factory('Projects', function () {  
    return {  
        all: function () {  
            var projectString = window.localStorage['projects'];  
            if (projectString) {  
                return angular.fromJson(projectString);  
            }  
            return [];  
        },  
        save: function (projects) {  
            window.localStorage['projects'] = angular.toJson(projects);  
        },  
        newProject: function (projectTitle) {  
            // Add a new project  
            return {  
                title: projectTitle,  
                tasks: []  
            };  
        },  
        getLastActiveIndex: function () {  
            return parseInt(window.localStorage['lastActiveProject']) || 0;  
        },  
        setLastActiveIndex: function (index) {  
            window.localStorage['lastActiveProject'] = index;  
        }  
    }  
})

