import { Prisma } from '@prisma/client';

export type ExpandedRecordType = Prisma.RecordGetPayload<{
  include: {
    LectureSection: {
      include: {
        Lecture: true;
        Professor: true;
      };
    };
  };
}>;
