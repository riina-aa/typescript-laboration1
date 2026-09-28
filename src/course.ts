export class Course {
    courseCode: string; 
    courseName: string; 
    courseSyllabus: string; 
    courseProgression: string; 

    constructor(code: string, name: string, syllabus: string, progression: string) {
        this.courseCode = code; 
        this.courseName = name; 
        this.courseSyllabus = syllabus; 
        this.courseProgression = progression; 
    }

    skrivUt(): string {
        return ""
    }
}