import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Student} from "../../student-data-source";
import {StudentService} from "../../student.service";

export interface DialogData {
  student: Student,
  title: string,
  isEdit: boolean
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, AfterViewInit {

  title!: string;
  student: Student = {
    id: undefined,
    email: undefined,
    lastName: undefined,
    firstName: undefined
  }

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly studentService: StudentService,
              private cdRef: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.title = this.data.title;
  }

  onSubmitTemplateBased() {
    this.student.id !== undefined ? this.studentService.updateStudent(this.student.id, this.student) : this.studentService.saveStudent(this.student)
    this.dialogRef.close()
  }

  ngAfterViewInit(): void {
    if (this.data.isEdit) {
      this.student.firstName = this.data.student.firstName
      this.student.email = this.data.student.email
      this.student.lastName = this.data.student.lastName
      this.student.id = this.data.student.id
      this.cdRef.detectChanges()
    }
  }
}
