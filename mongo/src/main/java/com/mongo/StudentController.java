package com.mongo;

import lombok.*;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class StudentController {

  private final StudentRepository studentRepository;

  @AllArgsConstructor
  @Builder
  @Getter
  @ToString
  static class StudentDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
  }

  @AllArgsConstructor
  @Getter
  static class ResponseMessage {
    private String message;
  }

  @PostMapping("/save")
  public ResponseEntity<ResponseMessage> createStudent(@RequestBody StudentDto studentDto) {
    studentRepository.save(Student.of(studentDto.getFirstName(), studentDto.getLastName(), studentDto.getEmail()));
    return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage("Student was added."));
  }

  @GetMapping("/students")
  public ResponseEntity<Page<StudentDto>> getStudents(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
    try {
      PageRequest pageRequest = PageRequest.of(page, size);
      Page<Student> students = studentRepository.findAll(pageRequest);

      List<StudentDto> insuranceRepresentations = students.stream()
              .map(student -> StudentDto.builder()
                      .email(student.getEmail())
                      .lastName(student.getLastName())
                      .firstName(student.getFirstName())
                      .id(student.getId())
                      .build())
              .collect(Collectors.toList());
      return new ResponseEntity<>(new PageImpl<>(insuranceRepresentations, pageRequest, students.getTotalElements()), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping("/students/{id}")
  public void deleteStudent(@PathVariable String id) {
    studentRepository.deleteById(id);
  }

  @PutMapping("/students/{id}")
  public void updateStudent(@PathVariable String id, @RequestBody StudentDto studentDto) {
    Student student = studentRepository.findById(id).orElseThrow(RuntimeException::new);
    student.update(studentDto.getFirstName(), studentDto.getLastName(), studentDto.getEmail());
    studentRepository.save(student);
  }

  @GetMapping("/students/{id}")
  public StudentDto getStudent(@PathVariable String id) {
    Student student = studentRepository.findById(id).orElseThrow(RuntimeException::new);
    return StudentDto.builder()
            .id(student.getId())
            .firstName(student.getFirstName())
            .lastName(student.getLastName())
            .email(student.getEmail())
            .build();
  }
}
