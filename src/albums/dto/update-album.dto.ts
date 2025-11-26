import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
