import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListEntrepriseComponent } from './list-entreprise.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListEntrepriseComponent', () => {
  let component: ListEntrepriseComponent;
  let fixture: ComponentFixture<ListEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
