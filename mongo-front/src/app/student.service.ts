import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment.prod";
import {Student} from "./student-data-source";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private studentsEndpoint: string = environment.apiUrl + "/students";
  private saveStudentEndpoint: string = environment.apiUrl + "/save";

  constructor(private http: HttpClient) {
  }

  public getStudents = (request: { size: number; page: number }) => {
    const params = request;
    return this.http.get(this.studentsEndpoint, {params});
  };

  public saveStudent(request: Student) {
    const params = request
    return this.http.post<Student>(this.saveStudentEndpoint, params).subscribe({error: err => console.log(err)});
  };

  public deleteStudent(id: string) {
    return this.http.delete(this.studentsEndpoint + "/" + id).subscribe({error: err => console.log(err)})
  }

  public getStudent(id: string) {
    return this.http.get(this.studentsEndpoint + "/" + id);
  }

  public updateStudent(id: string, request: Student) {
    const params = request
    return this.http.put<Student>(this.studentsEndpoint + "/" + id, params).subscribe({error: err => console.log(err)});
  }
}
