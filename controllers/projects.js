const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ฟังก์ชันสำหรับการสร้างข้อมูล projects ใหม่
const createProject = async (req, res) => {
    const {  ProjectID, ProjectName, Description, ImageURL, CompletionDate } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const project = await prisma.projects.create({
            data: {
                ProjectID,     
                ProjectName,    
                Description,    
                ImageURL,       
                CompletionDate, 
            },
        });
        res.status(200).json(project); // ส่งข้อมูลของ project ที่สร้างใหม่กลับไปยัง client
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูล projects
const updateProject = async (req, res) => {
    const { ProjectID, ProjectName, ClientName, StartDate, EndDate, Status, Budget, projectDetails } = req.body; // ดึงข้อมูลจาก body ของ request
    try {
        const project = await prisma.projects.update({
            data: {
                ProjectID,     
                ProjectName,   
                ClientName,    
                StartDate,     
                EndDate,       
                Status,        
                Budget,        
                projectDetails,
            },
            where: { ID: Number(req.params.ID) } // ค้นหาข้อมูลตาม ID
        });

        res.status(200).json(project); // ส่งข้อมูลที่อัปเดตกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับลบข้อมูล projects
const deleteProject = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const projectExists = await prisma.projects.findUnique({
            where: { ID: Number(ID) }, // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' }); // ถ้าไม่มีข้อมูลส่งสถานะ 404
        }

        const deletedProject = await prisma.projects.delete({
            where: { ID: Number(ID) }, // ลบข้อมูลตาม ID
        });

        res.status(200).json({ message: 'Project deleted successfully', deletedProject }); // ส่งข้อมูลการลบสำเร็จกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project', details: err }); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล projects ทั้งหมด
const getProjects = async (req, res) => {
    try {
        const projects = await prisma.projects.findMany(); // ดึงข้อมูลทั้งหมดจากตาราง projects
        res.json(projects); // ส่งข้อมูลกลับไปยัง client
    } catch (err) {
        res.status(500).json({ error: err.message }); // ส่งข้อผิดพลาดเมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับดึงข้อมูล projects ตาม ID
const getProjectByID = async (req, res) => {
    const ID = req.params.ID; // รับค่า ID จาก URL
    try {
        const project = await prisma.projects.findUnique({
            where: { ID: Number(ID) }, // ค้นหาข้อมูลตาม ID
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(project); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ฟังก์ชันสำหรับค้นหาข้อมูล projects ตามคำค้น (term)
const getProjectByTerm = async (req, res) => {
    const searchString = req.params.term; // รับคำค้นจาก URL
    try {
        const projects = await prisma.projects.findMany({
            where: {
                OR: [
                    {
                        ProjectName: {
                            contains: searchString // ค้นหาข้อมูลที่มี ProjectName ตรงกับคำค้น
                        }
                    },
                    {
                        ProjectID: {
                            contains: searchString // ค้นหาข้อมูลที่มี ProjectID ตรงกับคำค้น
                        }
                    }
                ]
            },
        });
        if (!projects || projects.length === 0) {
            res.status(404).json({ message: 'No projects found!' }); // ถ้าไม่พบข้อมูลส่งสถานะ 404
        } else {
            res.status(200).json(projects); // ส่งข้อมูลกลับไปยัง client
        }
    } catch (err) {
        res.status(500).json(err); // ส่งสถานะ 500 เมื่อเกิดข้อผิดพลาด
    }
};

// ส่งออกฟังก์ชันเหล่านี้เพื่อให้ใช้งานในที่อื่นได้
module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    getProjectByID,
    getProjectByTerm,
};
