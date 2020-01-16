import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyfundsComponent } from './dailyfunds.component';

describe('DailyfundsComponent', () => {
  let component: DailyfundsComponent;
  let fixture: ComponentFixture<DailyfundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyfundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyfundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
