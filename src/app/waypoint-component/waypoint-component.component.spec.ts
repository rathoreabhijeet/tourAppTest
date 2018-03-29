import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointComponentComponent } from './waypoint-component.component';

describe('WaypointComponentComponent', () => {
  let component: WaypointComponentComponent;
  let fixture: ComponentFixture<WaypointComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaypointComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaypointComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
