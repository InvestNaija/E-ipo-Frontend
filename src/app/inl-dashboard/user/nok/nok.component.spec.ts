import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoKComponent } from './nok.component';

describe('NoKComponent', () => {
  let component: NoKComponent;
  let fixture: ComponentFixture<NoKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoKComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
