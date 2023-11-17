import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceMapComponent } from './source-map.component';

describe('SourceMapComponent', () => {
  let component: SourceMapComponent;
  let fixture: ComponentFixture<SourceMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
