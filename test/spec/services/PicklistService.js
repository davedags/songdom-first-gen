'use strict';

describe('Service: PicklistService', function () {

  // load the service's module
  beforeEach(module('hackathonApp'));

  // instantiate service
  var PicklistService;
  beforeEach(inject(function (_PicklistService_) {
    PicklistService = _PicklistService_;
  }));

  it('should do something', function () {
    expect(!!PicklistService).toBe(true);
  });

});
