import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './types/team-member.interface';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  private readonly multerConfig = {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `team-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  };

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `team-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async create(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<TeamMember> {
    if (file) {
      createTeamMemberDto.photoUrl = `/uploads/team/${file.filename}`;
    }
    return this.teamService.create(createTeamMemberDto);
  }

  @Get()
  async findAll(): Promise<TeamMember[]> {
    return this.teamService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<TeamMember[]> {
    return this.teamService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TeamMember | null> {
    return this.teamService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/team',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `team-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async update(
    @Param('id') id: string, 
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<TeamMember | null> {
    try {
      console.log('Controller received update request for team member:', id);
      console.log('Update data:', JSON.stringify(updateTeamMemberDto, null, 2));
      
      if (file) {
        updateTeamMemberDto.photoUrl = `/uploads/team/${file.filename}`;
        console.log('File uploaded:', file.filename);
      }
      
      const result = await this.teamService.update(id, updateTeamMemberDto);
      if (!result) {
        throw new HttpException('Team member not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      console.error('Controller error updating team member:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Failed to update team member: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TeamMember | null> {
    return this.teamService.remove(id);
  }
}