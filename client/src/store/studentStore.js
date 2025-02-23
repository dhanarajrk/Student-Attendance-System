import { create } from "zustand";

const useStudentStore = create((set) => ({
  students: [],            //Storage for fetched student lists                         
  currentStudentIndex: 0,  //To keep track of current student index  By default: 0 (first student)        
  attendanceRecords: {},   //Key-value pair of studentId: status     eg. {"id101": "Present",  "id102": "Absent"}

  setStudents: (students) => set({ students }),  //func to update student lists

  markAttendance: (studentId, status) => set((state) => ({   //func to mark attence of a student and add it to attendanceRecords{}
      attendanceRecords: {...state.attendanceRecords, [studentId]: status,},   //Note [studentId] is written in [ ] because it is passed as dynamic name from frontend
    })),

  nextStudent: () =>  //func to increment index to move to next student
    set((state) => ({
      currentStudentIndex: state.currentStudentIndex + 1,
    })),

  prevStudent: () => //func to decrement index, and overwrite previous student status with markAttendance again.   (My appraoch overwriting previous record, But I can also use another appraoch by deleting previous state and insert again but this is bit complex so I went for the first approach)
    set((state) => {
      const prevIndex = state.currentStudentIndex - 1;
      if (prevIndex >= 0) {
        return { currentStudentIndex: prevIndex };
      }
      return state; 
    }),

}));

export default useStudentStore;