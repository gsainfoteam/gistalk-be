import { Prisma } from '@prisma/client';

export type ExpandedRecordType = Prisma.RecordGetPayload<{
  include: {
    lectureProfessor: {
      include: {
        lecture: true;
        professor: true;
      };
    };
  };
}>;
