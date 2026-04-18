export interface Exam {
    course: string;
    section: string;
    title: string;
    type: string;
    start: string;
    end: string;
    building?: string;
    room?: string;
    sections?: string[]; // Used when grouping multiple sections
}

export interface CourseChip {
    display: string;
    course: string;
    section: string | null;
    valid: boolean;
}
