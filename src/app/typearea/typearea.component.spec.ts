import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeareaComponent } from './typearea.component';

describe('TypeareaComponent', () => {
  let component: TypeareaComponent;
  let fixture: ComponentFixture<TypeareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeareaComponent]
    });
    fixture = TestBed.createComponent(TypeareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
