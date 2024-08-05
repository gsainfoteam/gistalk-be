import { Injectable } from '@nestjs/common';
import { ExpandedRecordType } from './types/ExpandedRecord.type';
import { ExpandedRecordResDto } from './dto/res/expandedRes.dto';

@Injectable()
export class RecordMapper {
  expandedRecordTypeToExpandedRecordResDto(
    expandedRecordType: ExpandedRecordType,
  ): ExpandedRecordResDto {
    const { RecordLike, ...rest } = expandedRecordType;
    const LectureSection = {
      id: expandedRecordType.LectureSection.id,
      lectureId: expandedRecordType.LectureSection.lectureId,
      Lecture: {
        id: expandedRecordType.LectureSection.Lecture.id,
        name: expandedRecordType.LectureSection.Lecture.name,
      },
      Professor: expandedRecordType.LectureSection.LectureSectionProfessor.map(
        (professor) => ({
          id: professor.Professor.id,
          name: professor.Professor.name,
        }),
      ),
    };
    return {
      ...rest,
      LectureSection,
      isLiked: RecordLike ? RecordLike.length > 0 : false,
    };
  }
}
