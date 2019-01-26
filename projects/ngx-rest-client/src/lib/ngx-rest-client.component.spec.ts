import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRestClientComponent } from './ngx-rest-client.component';

describe('NgxRestClientComponent', () => {
  let component: NgxRestClientComponent;
  let fixture: ComponentFixture<NgxRestClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRestClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRestClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
