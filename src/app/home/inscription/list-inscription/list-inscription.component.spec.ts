import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListInscriptionComponent } from './list-inscription.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListInscriptionComponent', () => {
  let component: ListInscriptionComponent;
  let fixture: ComponentFixture<ListInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
