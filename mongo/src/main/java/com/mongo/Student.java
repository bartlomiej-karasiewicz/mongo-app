package com.mongo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "student")
@Getter
@Builder
@ToString
public class Student {
  @Id
  private String id;
  private String firstName;
  private String lastName;
  private String email;

  public Student(String firstName, String lastName, String email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  static Student of(String firstName, String lastName, String email){
    return new Student(firstName, lastName, email);
  }

  public void update(String firstName, String lastName, String email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
