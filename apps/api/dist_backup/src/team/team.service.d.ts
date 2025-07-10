import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './types/team-member.interface';
export declare class TeamService {
    private parseJsonField;
    ensureUserExists(userId: string, userName: string): Promise<void>;
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember>;
    findAll(userId?: string): Promise<TeamMember[]>;
    findOne(id: string): Promise<TeamMember | null>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember | null>;
    remove(id: string): Promise<TeamMember | null>;
}
