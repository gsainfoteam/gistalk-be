import { Prisma } from '@prisma/client';

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
  _count?: {
    RecordLike: number;
  };
};
