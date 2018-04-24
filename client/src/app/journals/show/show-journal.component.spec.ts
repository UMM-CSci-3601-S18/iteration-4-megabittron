import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {ShowJournalComponent} from './show-journal.component';
import {CustomModule} from '../../custom.module';

describe('Show journal component', () => {

    let showJournalComponent: ShowJournalComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<ShowJournalComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ShowJournalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(ShowJournalComponent);
        showJournalComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        showJournalComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
