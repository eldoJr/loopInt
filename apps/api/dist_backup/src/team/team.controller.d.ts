import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './types/team-member.interface';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    private readonly multerConfig;
    create(createTeamMemberDto: CreateTeamMemberDto, file?: Express.Multer.File): Promise<TeamMember>;
    findAll(): Promise<TeamMember[]>;
    findByUser(userId: string): Promise<TeamMember[]>;
    findOne(id: string): Promise<TeamMember | null>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto, file?: Express.Multer.File): Promise<TeamMember | null>;
    remove(id: string): Promise<TeamMember | null>;
}
