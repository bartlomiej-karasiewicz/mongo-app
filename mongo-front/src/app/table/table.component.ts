import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {tap} from "rxjs/operators";
import {StudentService} from "../student.service";
import {Student, StudentDataSource} from "../student-data-source";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['options', 'firstName', 'lastName', 'email'];
  studentDataSource!: StudentDataSource;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  student: Student = {}
  term: string | undefined = undefined;

  constructor(private readonly studentService: StudentService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.studentDataSource = new StudentDataSource(this.studentService);
    this.studentDataSource.loadStudents();
  }

  ngAfterViewInit() {
    this.dataSourceSubscription()
    this.paginatorSubscription()
  }

  loadStudents() {
    this.studentDataSource.loadStudents(this.paginator.pageIndex, this.paginator.pageSize)
  }

  private dataSourceSubscription() {
    this.studentDataSource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
  }

  private paginatorSubscription() {
    this.paginator.page
      .pipe(
        tap(() => this.loadStudents())
      )
      .subscribe();
  }

  delete(element: string) {
    this.studentService.deleteStudent(element)
    this.studentDataSource.loadStudents();
    this.dataSourceSubscription()
    this.paginatorSubscription()
  }

  openEditDialog(element: string): void {
    this.studentService.getStudent(element).subscribe((res: Student) => {
      this.student.id = res.id;
      this.student.email = res.email;
      this.student.lastName = res.lastName;
      this.student.firstName = res.firstName;

      const dataDialog = {
        student: this.student,
        title: 'Edit student',
        isEdit: true
      }
      this.data(dataDialog);
    })

  }

  openAddDialog(): void {
    const dataDialog = {
      student: this.student,
      title: 'Add student',
      isEdit: false
    }
    this.data(dataDialog);
  }

  public loadFilterStudent() {
    this.studentDataSource.loadStudents(0, 10, this.term);
  }

  public clear() {
    this.term = ''
    this.studentDataSource.loadStudents();
  }

  private data(dataDialog: { student: Student; isEdit: boolean; title: string }) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: dataDialog
    });
    dialogRef.afterClosed().subscribe(() => {
      this.studentDataSource.loadStudents()
    });
  }
}
