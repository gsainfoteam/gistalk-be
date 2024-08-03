import { Prisma } from '@prisma/client';

export type ExpandedLecture = Prisma.LectureGetPayload<{
  include: {
    LectureCode: true;
    LectureSection: {
      include: {
        LectureSectionProfessor: {
          include: {
            Professor: true;
          };
        };
      };
    };
  };
}>;
