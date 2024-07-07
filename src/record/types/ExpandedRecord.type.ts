import { Prisma } from '@prisma/client';

export type ExpandedRecordType = Prisma.RecordGetPayload<{
  include: {
    lectureSection: {
      include: {
        lecture: true;
        lectureSectionProfessor: true;
      };
    };
  };
}>;
