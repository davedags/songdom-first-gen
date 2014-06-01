'use strict';

angular.module('dagsApp')
    .factory('UserService', function UserService($resource) {
        return $resource("/api/users/:id",
        {
            id: "@user_id"
        },
        {
            query: {
                method: "GET",
                //isArray: true
            },
            get: {
                method: "GET"
            },
            update: {
                method: "PUT"
            }
        });
    });
