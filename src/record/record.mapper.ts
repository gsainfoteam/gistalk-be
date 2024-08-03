import { Injectable } from '@nestjs/common';
import { ExpandedRecordType } from './types/ExpandedRecord.type';
import { ExpandedRecordResDto } from './dto/res/expandedRes.dto';

@Injectable()
export class RecordMapper {
  expandedRecordTypeToExpandedRecordResDto(
    expandedRecordType: ExpandedRecordType,
  ): ExpandedRecordResDto {
    const { RecordLike, ...rest } = expandedRecordType;
    return {
      ...rest,
      isLiked: RecordLike ? RecordLike.length > 0 : false,
    };
  }
}
