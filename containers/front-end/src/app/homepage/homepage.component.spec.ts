import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Modules
import { HttpClientModule } from '@angular/common/http';
// Components
import { HomepageComponent } from './homepage.component';
// Services
import { DashboardService } from '../dashboard.service';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageComponent ],
      providers: [DashboardService],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#initialization', () => {
    it('should create a HomepageComponent instance', () => {
      expect(component).toBeTruthy();
    });
  });
});
