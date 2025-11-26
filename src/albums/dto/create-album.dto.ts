import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
