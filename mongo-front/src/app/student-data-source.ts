import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {StudentService} from "./student.service";

export interface Student {
  id?: string,
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Students {
  content: Student[];
  totalElements: number;
}

export class StudentDataSource implements DataSource<Student> {

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();

  constructor(private studentService: StudentService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.studentsSubject.complete();
    this.loadingSubject.complete();
    this.countSubject.complete();
  }

  loadStudents(pageNumber = 0, pageSize = 10, term?: string | undefined) {
    this.loadingSubject.next(true);
    this.studentService.getStudents({page: pageNumber, size: pageSize, term: term})
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: Students | any) => {
          if (term) {
            this.studentsSubject.next(result.content.filter((student: Student) => student.firstName?.includes(term) || student.lastName?.includes(term)))
          } else {
            this.studentsSubject.next(result.content);
          }
          this.countSubject.next(result.totalElements);
        }
      );
  }
}
