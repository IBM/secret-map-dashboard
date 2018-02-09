import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Components
import { SideDisplayComponent } from './side-display.component';

describe('SideDisplayComponent', () => {
  let component: SideDisplayComponent;
  let fixture: ComponentFixture<SideDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#initialization', () => {
    it('should create a SideDisplayComponent instance', () => {
      expect(component).toBeTruthy();
    });
  });
});
