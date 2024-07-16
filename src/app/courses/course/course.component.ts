import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import {
  concatMap,
  delay,
  filter,
  first,
  map,
  shareReplay,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { CoursesHttpService } from "../services/courses-http.service";
import { CoursesEntityService } from "../services/courses-entity.service";
import { LessonEntityService } from "../services/lesson-entity.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  loading$: Observable<boolean>;

  displayedColumns = ["seqNo", "description", "duration"];

  nextPage = 0;

  constructor(
    private courseEntityService: CoursesEntityService,
    private lessonEntityService: LessonEntityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    this.course$ = this.courseEntityService.entities$.pipe(
      map((c) => c.find((y) => y.url == courseUrl))
    );

    this.lessons$ = this.lessonEntityService.entities$.pipe(
      withLatestFrom(this.course$),
      tap(([lessons, course]) => {
        if(this.nextPage == 0){
          this.loadLessonsPage(course)
        }
      }),
      map(([lessons, course]) =>
        lessons.filter((lesson) => lesson.courseId == course.id)
      )
    );

    this.loading$ = this.lessonEntityService.loading$.pipe(delay(0))
  }

  loadLessonsPage(course: Course) {
    this.lessonEntityService.getWithQuery({
      courseId: course.id.toString(),
      pageNumber: this.nextPage.toString(),
      pageSize: '3'
    });

    this.nextPage++;
  }
}
