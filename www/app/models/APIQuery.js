BallotApp.factory('APIQuery', function ($q, $http) {
    /**  ----- Constant Home Javascript Query API -----
     *
     *  Uses APIQuery object to construct a query to database
     *
     *  config {
     *      query_type: 'findOne', 'count', or no value (defaults to normal find);
     *      params: _params, // filter params
     *      skip: _skip, // initial cursor value
     *      limit: _limit, // how many models per query
     *      sort: _sort, // what value to order on. -order for DESC,
     *      select: _select // what fields to select
     *      populate: [{
     *          path: path,
     *          match: {...},
     *          select: '',
     *          options: { sort: '', limit: '', skip: ''},
     *      }, 'path1 path2.subpath', ...] // single object/string path or array of objects and string paths
     *      options: {} //some models may allow custom behavior that can be specified here
     *      You may use the shortcut 'name' for {name: 'name'} for any level of relation
     */

    function APIQuery(Model, config, url) {
        this._config = config || {};
        this.cursor = this._config.skip || 0;

        this.Model = Model;
        this.url = url || Model.url;
    }

    APIQuery.prototype.reset = function () {
        this.cursor = this._config.skip || 0;
    };

    APIQuery.prototype.setStart = function(skip){
        this._config.skip = skip;
        this.reset();
    };

    /**
     * Next executes a standard query.
     * @returns promise
     */
    APIQuery.prototype.next = function (count) {

        var deferred = $q.defer();
        var self = this;
        var param_obj = this.buildParams(count);
        $http({
            method: "GET",
            url: self.url,
            params: param_obj
        }).success(function (data) {
            var model_list = [];

            if (self.Model) {
                for (var i = 0; i < data.length; i++) {
                    model_list.push(new self.Model(data[i]));
                    self.cursor++;
                }
            } else {
                model_list = data;
                self.cursor += data.length;
            }

            deferred.resolve(model_list);
        })
            .error(function (e) {
                deferred.reject(e);
            });

        return deferred.promise;
    };

    APIQuery.prototype.checkHasNext = function() {
        var deferred = $q.defer();
        var self = this;
        var hasNext;

        this.next(1)
            .then(function(list) {
                hasNext = list.length > 0;
                if (hasNext) {
                    self.cursor--;
                }
                deferred.resolve(hasNext);
            });

        return deferred.promise;
    };

    /**
     * Returns a promise that resolves to one model or undefined
     *
     * Note: one() should not be used alongside next(). You should create separate query objects for each.
     * @returns {*}
     */
    APIQuery.prototype.one = function(){
        var deferred = $q.defer();
        var self = this;
        var params_obj = this.buildParams(1);
        params_obj.query_type = "findOne";

        $http({
            method: "GET",
            url: self.url,
            params: {q: JSON.stringify(params_obj), 'cb': new Date().getTime()}
        }).success(function (data) {
            if(data && self.Model){
                deferred.resolve(new self.Model(data))
            }else {
                deferred.resolve(data)
            }
        })
            .error(function (e) {
                deferred.reject(e);
            });
        return deferred.promise;
    };

    APIQuery.prototype.count = function(){
        var deferred = $q.defer();

        var self = this;
        var params_obj = {
            params: self._config.params,
            query_type: 'count'
        };

        $http({
            method: "GET",
            url: self.url,
            params: {q: JSON.stringify(params_obj), 'cb': new Date().getTime()}
        }).success(function (data) {
            deferred.resolve(data);
        })
            .error(function (e) {
                deferred.reject(e);
            });
        return deferred.promise;
    };

    APIQuery.prototype.buildParams = function(count){
        var self = this;
        var config = self._config;

        return {
            skip: self.cursor,
            params: config.params,
            select: config.select,
            populate: config.populate,
            limit: count || config.limit,
            sort: config.sort,
            options: config.options
        };
    };

    return {

        init: function (Model, config, url) {
            return new APIQuery(Model, config, url);
        },

        APIQuery: APIQuery
    };

});
