import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeorefDialogComponent } from './georef-dialog.component';

describe('GeorefDialogComponent', () => {
  let component: GeorefDialogComponent;
  let fixture: ComponentFixture<GeorefDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeorefDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeorefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
