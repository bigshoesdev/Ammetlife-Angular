import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DashboardService } from 'src/app/services';
import { finalize, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html'
})
export class UploadComponent {

    form: FormGroup;
    loading: boolean = false;
    error: any;
    previewData: any;
    fileName: string;
    step: number;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(private FB: FormBuilder, private DS: DashboardService) {
        this.step = 1;
        this.createForm();
    }

    createForm() {
        this.form = this.FB.group({
            file: ['', Validators.required]
        });
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            const extension = file.name.split('.')[1].toLowerCase();
            if ('xlsx' !== extension) {
                this.error = "Invalid file, please upload excel file only.";
                this.clearFile();
                return;
            }
            if (file.size <= 0) {
                this.error = "File is empty, Please upload the valid file.";
                this.clearFile();
                return;
            }
            this.form.get('file').setValue(file);
            this.fileName = file.name.split("\\").pop();
        }
    }

    private prepareSave(): any {
        if (this.step == 1) {
            let input = new FormData();
            input.append('file', this.form.get('file').value);
            input.append('step', this.step.toString());
            return input;
        } else if (this.step == 2) {
            let input = {
                data: this.previewData,
                step: this.step
            };
            return input;
        }
    }

    onSubmit() {
        const formModel = this.prepareSave();
        this.loading = true;
        this.error = null;
        this.DS.uploadFunds(formModel)
            .pipe(
                finalize(
                    () => {
                        this.loading = false;
                    }
                ),
                map((data) => {
                    if (this.step == 1) {
                        return data.map((f: any) => {
                            return {
                                name: f.name,
                                price: f.price,
                                date: moment(f.date).format('DD MMM YYYY')
                            };
                        });
                    } else {
                        return data;
                    }
                })
            )
            .subscribe(
                res => {
                    if (this.step == 1) {
                        console.log(res);
                        this.previewData = res ? res : null;
                        this.clearFile();
                    } else {
                        this.previewData = null;
                    }
                    this.increaseStep();
                },
                error => {
                    if (this.step == 1) {
                        this.clearFile();
                    }
                    this.error = <any>error;
                }
            );
    }

    clearFile() {
        this.form.get('file').setValue(null);
        this.fileInput.nativeElement.value = '';
        this.fileName = null;
    }

    stepBack() {
        if (this.step > 1) {
            this.decreaseStep();
        }
        this.previewData = null;
    }

    increaseStep() {
        this.step = this.step + 1;
    }

    decreaseStep() {
        this.step = this.step - 1;
    }
}
