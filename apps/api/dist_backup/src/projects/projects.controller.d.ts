import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './types/project.interface';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    findByUser(userId: string): Promise<Project[]>;
    findOne(id: string): Promise<Project | null>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project | null>;
    remove(id: string): Promise<Project | null>;
}
