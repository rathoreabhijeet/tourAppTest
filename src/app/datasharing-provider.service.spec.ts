import { TestBed, inject } from '@angular/core/testing';

import { DatasharingProviderService } from './datasharing-provider.service';

describe('DatasharingProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasharingProviderService]
    });
  });

  it('should be created', inject([DatasharingProviderService], (service: DatasharingProviderService) => {
    expect(service).toBeTruthy();
  }));
});
