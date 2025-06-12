import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFinder } from './media-finder';

describe('MediaFinder', () => {
  let component: MediaFinder;
  let fixture: ComponentFixture<MediaFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaFinder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaFinder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
