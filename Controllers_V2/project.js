const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new project
const createProject = async (req, res) => {
    const { ProjectName, Description, ImageURL } = req.body;

    try {
        const newProject = await prisma.projects.create({
            data: {
                ProjectName,
                Description,
                ImageURL
            }
        });
        res.status(201).json({
            status: 'ok',
            message: 'Project created successfully',
            newProject
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create project',
            error
        });
    }
};

// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.projects.findMany();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch projects',
            error
        });
    }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await prisma.projects.findUnique({
            where: {
                ProjectID: parseInt(projectId, 10)
            }
        });

        if (!project) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Project not found' 
            });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch project',
            error
        });
    }
};

// Update a project
const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { ProjectName, Description, ImageURL } = req.body;

    const data = {};
    if (ProjectName) data.ProjectName = ProjectName;
    if (Description) data.Description = Description;
    if (ImageURL) data.ImageURL = ImageURL;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update' 
        });
    }

    try {
        const updatedProject = await prisma.projects.update({
            where: { ProjectID: parseInt(projectId, 10) },
            data
        });

        res.status(200).json({
            status: 'ok',
            message: `Project with ID = ${projectId} is updated`,
            updatedProject
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Project with ID = ${projectId} not found` 
            });
        } else {
            console.error('Update project error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const deletedProject = await prisma.projects.delete({
            where: { ProjectID: parseInt(projectId, 10) }
        });

        res.status(200).json({
            status: 'ok',
            message: `Project with ID = ${projectId} is deleted`,
            deletedProject
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({ 
                status: 'error',
                message: `Project with ID = ${projectId} not found` 
            });
        } else {
            console.error('Delete project error:', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
    }
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
