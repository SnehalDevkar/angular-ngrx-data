import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";
import { Course } from "../model/course";
import { Injectable } from "@angular/core";

@Injectable()
export class CoursesEntityService extends EntityCollectionServiceBase<Course> {
 
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Course', serviceElementsFactory);
  }
}