import React, { useState } from 'react';
import useRole from '../../../hooks/useRole';
import StudentOnlineExam from '../../StudentPanel/StudentOnlineExam/StudentOnlineExam';
import TeacherOnlineExam from '../../TeacherPanel/TeacherOnlineExam/TeacherOnlineExam';

const OnlineExam = () => {
  const [toggleExamMode, setToggleExamMode] = useState('old');
  const [role] = useRole();
  return (
    <div className='px-2'>
      <h2 className='text-center py-1 text-3xl'>Online Exam</h2>
      <div className='flex  gap-3 justify-center'>
        <button
          className={`btn btn-sm rounded-full btn-primary w-42 lg:uppercase normal-case  ${
            toggleExamMode === 'old' && 'btn-disabled'
          }`}
          onClick={() => setToggleExamMode('old')}
        >
          View Existing Exams
        </button>
        <button
          className={`btn btn-sm rounded-full btn-primary w-42 lg:uppercase normal-case ${
            toggleExamMode === 'new' && 'btn-disabled'
          }`}
          onClick={() => setToggleExamMode('new')}
        >
          {role === 'student' ? 'Participate' : 'Launch'} New Exam
        </button>
      </div>
      {role === 'student' && (
        <StudentOnlineExam toggleExamMode={toggleExamMode} />
      )}
      {role === 'teacher' && (
        <TeacherOnlineExam toggleExamMode={toggleExamMode} />
      )}
    </div>
  );
};

export default OnlineExam;
