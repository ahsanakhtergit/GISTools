import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetMapComponent } from './target-map.component';

describe('TargetMapComponent', () => {
  let component: TargetMapComponent;
  let fixture: ComponentFixture<TargetMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
