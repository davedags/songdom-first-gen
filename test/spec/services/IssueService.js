'use strict';

describe('Service: IssueService', function () {

  // load the service's module
  beforeEach(module('hackathonApp'));

  // instantiate service
  var IssueService;
  beforeEach(inject(function (_IssueService_) {
    IssueService = _IssueService_;
  }));

  it('should do something', function () {
    expect(!!IssueService).toBe(true);
  });

});
