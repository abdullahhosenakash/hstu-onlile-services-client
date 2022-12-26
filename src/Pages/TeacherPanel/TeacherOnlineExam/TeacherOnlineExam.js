import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useDepartment from '../../../hooks/useDepartment';
import useMaxDate from '../../../hooks/useMaxDate';
import CQ from '../../Shared/OnlineExam/CQ';
import AvailableQuestions from './AvailableQuestions';

const TeacherOnlineExam = ({ toggleExamMode }) => {
  const [examType, setExamType] = useState('cq');
  const [questions, setQuestions] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [dept] = useDepartment(faculty);
  const [department, setDepartment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editQuestion, setEditQuestion] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState(false);
  const [level, setLevel] = useState('');
  const [semester, setSemester] = useState('');

  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const [maxDate] = useMaxDate(year, month, date);

  const questionSubmit = (e) => {
    e.preventDefault();
    const questionText = e.target.questionField.value;
    if (questionText) {
      const newQuestion = {
        questionId: questions.length + 1,
        question: questionText
      };
      setQuestions([...questions, newQuestion]);
      e.target.reset();
    } else {
      setErrorMessage('Please write the question first');
    }
  };

  const updateQuestionButton = (updatedQuestionText, questionId) => {
    if (updatedQuestionText) {
      const updatedQuestions = questions.map((q) => {
        if (q.questionId !== questionId) {
          return q;
        } else {
          q.question = updatedQuestionText;
          return q;
        }
      });
      setQuestions(updatedQuestions);
    }
    setEditQuestion(!editQuestion);
  };

  const editQuestionButton = (questionId, isEditQuestion) => {
    setQuestionToEdit(questionId);
    setEditQuestion(isEditQuestion);
  };

  const deleteQuestion = (questionId) => {
    const restQuestions = questions.filter((q) => q.questionId !== questionId);
    setQuestions(restQuestions);
  };

  const launchQuestions = (e) => {
    e.preventDefault();
    const duration = e.target.duration.value;
    const examDateTime = e.target.examDateTime.value;
    const examQuestion = {
      examType,
      courseTeacher: 'ABCD',
      courseCode: 'ECE 443',
      courseTitle: 'Database Design',
      duration: duration + ' minutes',
      examDateTime,
      questions
    };
    // console.log(examQuestion);

    fetch('http://localhost:5000/examQuestions', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(examQuestion)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success('Question added!');
          e.target.reset();
          setQuestions([]);
          setPreviewQuestion(false);
          setFaculty('');
          setDepartment('');
          setLevel('');
          setSemester('');
        }
      });
  };
  console.log(department);
  return (
    <div>
      {toggleExamMode === 'new' ? (
        <>
          <div className='fpy-2'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <div className=''>
                <label className='label'>
                  <span className='label-text text-lg'>Faculty</span>
                </label>
                <select
                  className='select select-primary w-80 lg:w-96 text-base font-normal'
                  onChange={(e) => setFaculty(e.target.value)}
                >
                  <option value='' selected={!faculty}>
                    - - Select Faculty - -
                  </option>
                  <option value='agriculture'>Agriculture</option>
                  <option value='cse'>Computer Science and Engineering</option>
                  <option value='bs'>Business Studies</option>
                  <option value='fisheries'>Fisheries</option>
                  <option value='dvm'>Veterinary and Animal Science</option>
                  <option value='engineering'>Engineering</option>
                  <option value='science'>Science</option>
                  <option value='ssh'>Social Science and Humanities</option>
                </select>
              </div>
              <div className=''>
                <label className='label'>
                  <span className='label-text text-lg'>Department</span>
                </label>
                <select
                  className='select select-primary w-80 lg:w-96 text-base font-normal'
                  disabled={!faculty}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value='' selected={!faculty}>
                    - - Select Department - -{' '}
                  </option>
                  {dept?.map((d, index) => (
                    <option key={index} value={d.deptValue}>
                      {d.dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='flex items-center justify-center gap-1 lg:gap-x-16 pb-2'>
              <div className=''>
                <label className='label'>
                  <span className='label-text text-lg'>Level</span>
                </label>
                <select
                  className='select select-primary w-40 text-base font-normal'
                  disabled={!department}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value='' selected={!faculty}>
                    - - Level - -
                  </option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                </select>
              </div>
              <div className=''>
                <label className='label'>
                  <span className='label-text text-lg'>Semester</span>
                </label>
                <select
                  className='select select-primary w-40 text-base font-normal'
                  disabled={!level}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value='' selected={!faculty}>
                    - - Semester - -
                  </option>
                  <option value='I'>I</option>
                  <option value='II'>II</option>
                </select>
              </div>
            </div>
          </div>
          {semester ? (
            <div>
              <div className='flex justify-center gap-2 pb-2'>
                <button
                  className={`btn btn-sm rounded-full btn-primary w-16 ${
                    examType === 'cq' && 'btn-disabled'
                  }`}
                  onClick={() => setExamType('cq')}
                >
                  CQ
                </button>
                <button
                  className={`btn btn-sm rounded-full btn-primary w-16 ${
                    examType === 'mcq' && 'btn-disabled'
                  }`}
                  onClick={() => setExamType('mcq')}
                >
                  MCQ
                </button>
              </div>
              {/* Questions */}
              <div className='overflow-x-auto w-full'>
                {previewQuestion ? (
                  <CQ questions={questions} preview={true} />
                ) : (
                  <form onSubmit={(e) => questionSubmit(e)}>
                    <table
                      className='table table-zebra lg:w-1/2 mx-auto rounded-full'
                      data-theme='dark'
                    >
                      {/* Table Head */}
                      <thead className='text-center'>
                        <tr>
                          <th className='w-8'>SL</th>
                          <th className=''>Question</th>
                          <th className='w-8'>Action</th>
                        </tr>
                      </thead>
                      {/* Table Body */}
                      <tbody className='text-center'>
                        {questions.length ? (
                          <>
                            {questions.map((q, index) => (
                              <AvailableQuestions
                                q={q}
                                index={index}
                                key={index}
                                editQuestion={editQuestion}
                                editQuestionButton={editQuestionButton}
                                questionToEdit={questionToEdit}
                                errorMessage={errorMessage}
                                setErrorMessage={setErrorMessage}
                                updateQuestionButton={updateQuestionButton}
                                deleteQuestion={deleteQuestion}
                              />
                            ))}
                          </>
                        ) : (
                          <tr></tr>
                        )}
                        {/* add new question */}
                        {!editQuestion ? (
                          <tr>
                            <td>{questions.length + 1}</td>
                            <td className='relative'>
                              <textarea
                                name='questionField'
                                className='textarea bg-white text-lg text-black w-full'
                                placeholder='Question'
                                onFocus={() => setErrorMessage('')}
                              />
                              <p className='text-sm p-0 bottom-px text-center text-red-400 absolute inset-x-1/4'>
                                {errorMessage}
                              </p>
                            </td>

                            <td>
                              <button
                                type='submit'
                                className='btn btn-sm lg:btn-md rounded-full btn-primary w-20'
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr></tr>
                        )}
                      </tbody>
                    </table>
                  </form>
                )}
                {questions.length ? (
                  <p className='text-xl text-center py-2'>
                    {previewQuestion
                      ? 'Edit Questions?'
                      : 'Done making questions?'}
                    <span
                      className='text-primary pl-2 cursor-pointer'
                      onClick={() => setPreviewQuestion(!previewQuestion)}
                    >
                      {previewQuestion ? 'click here' : 'see preview'}
                    </span>
                  </p>
                ) : (
                  ''
                )}

                {previewQuestion ? (
                  <>
                    <form onSubmit={(e) => launchQuestions(e)}>
                      <div className='flex flex-col lg:flex-row justify-center items-center gap-2 py-2'>
                        <div className=''>
                          <label className='label'>
                            <span className='font-bold'>
                              Time Duration (in minutes)
                            </span>
                          </label>
                          <input
                            type='number'
                            name='duration'
                            placeholder='Enter duration'
                            className='input input-primary w-[21rem] lg:w-60'
                            required
                            min={0}
                          />
                        </div>
                        <div className=''>
                          <label className='label'>
                            <span className='font-bold'>Exam Date-Time</span>
                          </label>
                          <input
                            type='datetime-local'
                            name='examDateTime'
                            min={`${year}-${month}-${date}T08:00`}
                            max={maxDate}
                            defaultValue={`${year}-${month}-${date}T08:00`}
                            className='input input-primary w-[21rem] lg:w-60'
                            required
                          />
                        </div>
                      </div>
                      <button className='btn btn-primary rounded-full flex mx-auto lg:w-1/5'>
                        Launch Questions
                      </button>
                    </form>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default TeacherOnlineExam;
