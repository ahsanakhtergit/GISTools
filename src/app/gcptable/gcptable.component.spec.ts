import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GCPTableComponent } from './gcptable.component';

describe('GCPTableComponent', () => {
  let component: GCPTableComponent;
  let fixture: ComponentFixture<GCPTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GCPTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GCPTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
