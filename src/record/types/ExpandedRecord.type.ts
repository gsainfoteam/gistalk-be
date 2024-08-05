import { Prisma, RecordLike } from '@prisma/client';

export type ExpandedRecordType = Prisma.RecordGetPayload<{
  include: {
    LectureSection: {
      include: {
        Lecture: true;
        LectureSectionProfessor: {
          include: {
            Professor: true;
          };
        };
      };
    };
  };
}> & {
  RecordLike?: RecordLike[];
  _count?: {
    RecordLike: number;
  };
};
