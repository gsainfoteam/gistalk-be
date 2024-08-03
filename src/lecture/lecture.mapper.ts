import { Injectable } from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { ExpandedLecture } from './types/expandedLecture.type';

@Injectable()
export class LectureMapper {
  expandedLectureToExpandedLectureResDto(
    expandedLecture: ExpandedLecture,
  ): ExpandedLectureResDto {
    const LectureSection = expandedLecture.LectureSection.map((section) => ({
      id: section.id,
      lectureId: section.lectureId,
      Professor: section.LectureSectionProfessor.map((professor) => ({
        id: professor.Professor.id,
        name: professor.Professor.name,
      })),
    }));
    return {
      ...expandedLecture,
      LectureSection,
    };
  }
}
