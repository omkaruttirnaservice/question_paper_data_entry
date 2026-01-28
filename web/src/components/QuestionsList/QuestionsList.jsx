import { IoGridOutline, IoNewspaper } from 'react-icons/io5';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

import { useEffect, useState } from 'react';
import {
    FaArrowAltCircleLeft,
    FaArrowAltCircleRight,
    FaEdit,
    FaEye,
    FaGripLinesVertical,
    FaListUl,
    FaPrint,
} from 'react-icons/fa';

import { FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    getEditQuestionDetailsThunk,
    getPostListThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
    QuestionFormActions,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';

let SERVER_IP = import.meta.env.VITE_API_IP;

import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import EditQuestionForm from '../QuestionForm/EditQuestionForm.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import PDFGenerator from '../PDFGenerator.jsx';
import Input from '../UI/Input.jsx';
import { _questionListView } from '../utils/constants.jsx';
function QuestionsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        data: _formData,
        postsList,
        subjectsList,
        topicsList,
        isEdit,
    } = useSelector((state) => state.questionForm);

    const { isLoading } = useSelector((state) => state.loader);
    const questionsList = useSelector((state) => state.questionForm.questionsList);

    const { sendRequest } = useHttp();

    useEffect(() => {
        if (postsList.length === 0) {
            dispatch(getPostListThunk(sendRequest));
        }
    }, []);

    useEffect(() => {
        dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
    }, [_formData.post_id]);

    useEffect(() => {
        dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
    }, [_formData.subject_id]);

    async function getQuestions() {
        let reqData = {
            url: SERVER_IP + '/api/questions/list',
            method: 'POST',
            body: JSON.stringify({
                post_id: _formData.post_id,
                subject_id: _formData.subject_id,
                topic_id: _formData.topic_id,
            }),
        };
        sendRequest(reqData, (data) => {
            dispatch(QuestionFormActions.setQuestionsList(data.data));
        });
    }

    useEffect(() => {
        if (!_formData.topic_id && !_formData.subject_id && !_formData.topic_id) {
            return;
        }
        getQuestions();
    }, [_formData.topic_id]);

    const handleGetQuestionsList = () => getQuestions();

    const handleDeleteQuestion = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This question will move to recycle bin!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                confirmDeleteQuestionTemp(id);
            }
        });
    };

    const confirmDeleteQuestionTemp = (id) => {
        let reqData = {
            url: SERVER_IP + '/api/questions/delete',
            method: 'DELETE',
            body: JSON.stringify({ questionId: id }),
        };
        sendRequest(reqData, (data) => {
            if (data.success == 1) {
                dispatch(
                    QuestionFormActions.setQuestionsList(questionsList.filter((el) => el.id != id)),
                );
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Question has been moved to recycle bin.',
                    icon: 'success',
                });
            }
        });
    };

    const handleEditQuestion = (id) => {
        dispatch(getEditQuestionDetailsThunk(id, sendRequest, _formData.post_id));
    };

    useEffect(() => {
        if (isEdit) {
            dispatch(ModalActions.toggleModal('edit-question-modal'));
        }
    }, [isEdit]);

    const [listMode, setListMode] = useState(_questionListView.LIST);
    const [isAscending, setIsAscending] = useState(true);

    const toggleListMode = (val) => setListMode(val);

    useEffect(() => {
        if (questionsList.length > 0) {
            const sorted = sortQuestionsList(questionsList);
            dispatch(QuestionFormActions.setQuestionsList(sorted));
        }
    }, [isAscending]);

    function sortQuestionsList(questionsList) {
        const updatedList = [...questionsList];
        const n = updatedList.length;

        if (isAscending) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (updatedList[j].id > updatedList[j + 1].id) {
                        let temp = updatedList[j];
                        updatedList[j] = updatedList[j + 1];
                        updatedList[j + 1] = temp;
                    }
                }
            }
        }

        if (!isAscending) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n - i - 1; j++) {
                    if (updatedList[j].id < updatedList[j + 1].id) {
                        let temp = updatedList[j];
                        updatedList[j] = updatedList[j + 1];
                        updatedList[j + 1] = temp;
                    }
                }
            }
        }
        return updatedList;
    }

    return (
        <>
            <CModal id={'edit-question-modal'} title={'Edit Question'} className={`min-w-[95vw]`}>
                <EditQuestionForm />
            </CModal>

            <CModal id={'view-pdf-modal'} title={'Questions Print List'} className={`min-w-[95vw]`}>
                <PDFGenerator questions={questionsList} />
            </CModal>

            <div className="container mx-auto mt-6 border p-2">
                <div className="grid grid-cols-5 gap-3 mb-6 items-end">
                    <PostListDropdown isShowAddNewBtn={false} />
                    <SubjectListDropdown isShowAddNewBtn={false} />
                    <TopicListDropdown isShowAddNewBtn={false} />
                    <CButton className={'h-fit mt-auto'} onClick={handleGetQuestionsList}>
                        Search
                    </CButton>

                    <div className="border w-fit flex items-center h-fit justify-self-end">
                        {/* ASCENDING | DESCENGING FILTERS BUTTON */}
                        <div
                            className={`bg-white p-3 cursor-pointer`}
                            onClick={() => setIsAscending(!isAscending)}>
                            {!isAscending && <TbSortAscending className="" />}
                            {isAscending && <TbSortDescending className="" />}
                        </div>

                        {/* View Toggle button */}
                        <div
                            onClick={toggleListMode.bind(null, _questionListView.LIST)}
                            className={`${
                                listMode === _questionListView.LIST ? 'bg-gray-200' : 'bg-white'
                            } p-3 cursor-pointer`}>
                            <FaListUl className="" />
                        </div>
                        <div
                            onClick={toggleListMode.bind(null, _questionListView.SPLIT)}
                            className={`${
                                listMode === _questionListView.SPLIT ? 'bg-gray-200' : 'bg-white'
                            } p-3 cursor-pointer`}>
                            <IoGridOutline />
                        </div>

                        <div
                            onClick={toggleListMode.bind(null, _questionListView.EXAM_THEME_1)}
                            className={`${
                                listMode === _questionListView.EXAM_THEME_1
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            } p-3 cursor-pointer`}>
                            <IoNewspaper />
                        </div>

                        {/* Print buttons */}
                        <div
                            className="p-3 cursor-pointer"
                            onClick={() => {
                                dispatch(ModalActions.toggleModal('view-pdf-modal'));
                                // navigate(`/print?post=${_formData.post_id}
                                //                     &subject=${_formData.subject_id}
                                //                     &topic=${_formData.topic_id}
                                //                     &view=${listMode ? 'LIST' : 'SPLIT'}`);
                            }}>
                            <FaPrint />
                        </div>
                    </div>
                </div>

                <div className="bg-cyan-100 px-4">
                    <div className="flex items-center py-3 gap-3">
                        <p>Total posts</p>
                        <FaAngleRight />
                        <span className="underline">{postsList.length}</span>

                        <FaGripLinesVertical />
                        <p>Total Subjets</p>
                        <FaAngleRight />
                        <span className="underline">{subjectsList.length}</span>

                        <FaGripLinesVertical />
                        <p>Total Topics</p>
                        <FaAngleRight />
                        <span className="underline">{topicsList.length}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-6">
                {isLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin text-2xl m-3 mx-auto" />
                )}
                {!isLoading && questionsList.length === 0 && (
                    <p className="text-center text-[#555]">
                        Woops! no questions found!&nbsp;
                        <span
                            className="underline text-blue-600 cursor-pointer"
                            onClick={() => {
                                navigate('/question-form');
                            }}>
                            Add Question
                        </span>
                    </p>
                )}

                {questionsList.length > 0 && listMode === _questionListView.LIST && (
                    <QuestionsListAccordion
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {questionsList.length > 0 && listMode === _questionListView.SPLIT && (
                    <QuestionsListIEEFormat
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {questionsList.length > 0 && listMode === _questionListView.EXAM_THEME_1 && (
                    <ExamThemeView
                        questionsList={questionsList}
                        renderTopicHeader={''}
                        handleEditQuestion={handleEditQuestion}
                    />
                )}
            </div>
        </>
    );
}

function QuestionsListAccordion({ questionsList, handleEditQuestion, handleDeleteQuestion }) {
    const [expandedItem, setExpandedItem] = useState(null);

    const handleAccordionChange = (e) => {
        if (e[0] == expandedItem) {
            setExpandedItem(null);
        } else {
            setExpandedItem(e[0]);
        }
    };

    return (
        <>
            <div className={`overflow-auto h-[500px] border p-2`}>
                <Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
                    {questionsList.length >= 1 &&
                        questionsList.map((el, idx) => {
                            return (
                                <AccordionItem className="border p-0.5 mb-1" key={idx} uuid={idx}>
                                    <AccordionHeadingItem
                                        expandedItem={expandedItem}
                                        idx={idx}
                                        el={el}
                                        handleEditQuestion={handleEditQuestion}
                                        handleDeleteQuestion={handleDeleteQuestion}
                                    />
                                    <AccordionItemPanel className="py-3 px-4">
                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block">
                                                Question
                                            </span>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_question,
                                                }}></p>
                                        </div>

                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block">
                                                Option A
                                            </span>

                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_opt_one,
                                                }}></p>
                                        </div>

                                        <hr />

                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block">
                                                Option B
                                            </span>

                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_opt_two,
                                                }}></p>
                                        </div>

                                        <hr />

                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block">
                                                Option C
                                            </span>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_opt_three,
                                                }}></p>
                                        </div>

                                        <hr />

                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block">
                                                Option D
                                            </span>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_opt_four,
                                                }}></p>
                                        </div>

                                        <hr />

                                        {el.mqs_opt_five && (
                                            <div className="py-3">
                                                <span className="font-bold text-[#555] mb-4 block">
                                                    Option E
                                                </span>
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: el.mqs_opt_five,
                                                    }}></p>
                                            </div>
                                        )}

                                        <hr />

                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 me-3">
                                                Correct Option
                                            </span>
                                            <span className="mb-6 bg-blue-200 px-2 py-1 w-fit">
                                                {el.mqs_ans}
                                            </span>
                                        </div>

                                        <hr />

                                        {el.mqs_solution && (
                                            <div className="py-3">
                                                <span className="font-bold text-[#555] my-4 block">
                                                    Solution
                                                </span>
                                                <p
                                                    dangerouslySetInnerHTML={{
                                                        __html: el.mqs_solution,
                                                    }}></p>
                                            </div>
                                        )}
                                    </AccordionItemPanel>
                                </AccordionItem>
                            );
                        })}
                </Accordion>
            </div>
        </>
    );
}

function AccordionHeadingItem({ expandedItem, idx, el, handleEditQuestion, handleDeleteQuestion }) {
    console.log(expandedItem);
    console.log(idx);
    return (
        <>
            <AccordionItemHeading
                className={`border-b py-3 max-h-[7rem] overflow-hidden bg-gray-200 px-4 ${
                    expandedItem == idx ? 'bg-cyan-500' : ''
                }`}>
                <AccordionItemButton>
                    <div className="flex justify-between items-center  ">
                        <div className={` w-full overflow-hidden`}>
                            <p className="font-bold text-[#555] mb-4 block text-start">
                                (<span>#{idx + 1}</span>) (
                                <span className="text-slate-500 ">Qid:{el.id}</span>)
                            </p>
                            {expandedItem != idx && (
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: el.mqs_question,
                                    }}></p>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <FaPencil
                                    className="text-green-800 hover:scale-[1.2] transition-all duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditQuestion(el.id);
                                    }}
                                />

                                <FaTrash
                                    className="text-red-800 hover:scale-[1.2] transition-all duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteQuestion(el.id);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionItemButton>
            </AccordionItemHeading>
        </>
    );
}

function QuestionsListIEEFormat({ questionsList, handleEditQuestion, handleDeleteQuestion }) {
    return (
        <>
            <div className="h-[500px] overflow-auto border p-2">
                <div className="columns-2">
                    {questionsList.map((el, idx) => {
                        return (
                            <div
                                className={`border transition-all duration-300  mb-5 shadow-sm bg-gray-100 relative que-container`}
                                key={idx}>
                                <CButton
                                    icon={<FaEdit />}
                                    onClick={handleEditQuestion.bind(null, el.id)}
                                    className={'absolute top-0 right-0 edit-que-btn'}>
                                    Edit
                                </CButton>
                                <div className="py-3 px-4 text-start">
                                    <div className="py-3">
                                        <p className="font-bold text-[#555] mb-4 block text-start">
                                            (<span>#{idx + 1}</span>) (
                                            <span className="text-slate-500 ">Qid:{el.id}</span>)
                                        </p>
                                        <p
                                            className="text-start"
                                            dangerouslySetInnerHTML={{
                                                __html: el.mqs_question,
                                            }}></p>
                                    </div>

                                    <div className="py-3">
                                        <span className="font-bold text-[#555] mb-4 block text-start">
                                            Option A
                                        </span>

                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: el.mqs_opt_one,
                                            }}></p>
                                    </div>

                                    <hr />

                                    <div className="py-3">
                                        <span className="font-bold text-[#555] mb-4 block text-start">
                                            Option B
                                        </span>

                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: el.mqs_opt_two,
                                            }}></p>
                                    </div>

                                    <hr />

                                    <div className="py-3">
                                        <span className="font-bold text-[#555] mb-4 block text-start">
                                            Option C
                                        </span>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: el.mqs_opt_three,
                                            }}></p>
                                    </div>

                                    <hr />

                                    <div className="py-3">
                                        <span className="font-bold text-[#555] mb-4 block text-start">
                                            Option D
                                        </span>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: el.mqs_opt_four,
                                            }}></p>
                                    </div>

                                    <hr />

                                    {el.mqs_opt_five && (
                                        <div className="py-3">
                                            <span className="font-bold text-[#555] mb-4 block text-start">
                                                Option E
                                            </span>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_opt_five,
                                                }}></p>
                                        </div>
                                    )}

                                    <hr />

                                    <div className="py-3">
                                        <span className="font-bold text-[#555] mb-4 me-3">
                                            Correct Option
                                        </span>
                                        <span className="mb-6 bg-blue-200 px-2 py-1 w-fit">
                                            {el.mqs_ans?.toUpperCase()}
                                        </span>
                                    </div>

                                    <hr />

                                    {el.mqs_solution && (
                                        <div className="py-3">
                                            <span className="font-bold text-[#555] my-4 block text-start">
                                                Solution
                                            </span>
                                            <p
                                                className="text-start"
                                                dangerouslySetInnerHTML={{
                                                    __html: el.mqs_solution,
                                                }}></p>
                                        </div>
                                    )}

                                    <hr />

                                    <div className=" bg-gray-300 p-3 ">
                                        <h3>Publication Info</h3>

                                        <table className="w-full">
                                            <thead>
                                                <th className="border px-2 py-1">Pub. Name</th>
                                                <th className="border px-2 py-1">Book Name</th>
                                                <th className="border px-2 py-1">Pg No</th>
                                            </thead>
                                            <tr className="text-center">
                                                <td className="border px-2 py-1">
                                                    {el?.msq_publication_name || el?.pub_name
                                                        ? el.msq_publication_name || el?.pub_name
                                                        : 'NA'}
                                                </td>
                                                <td className="border px-2 py-1">
                                                    {el.msq_book_name ? el.msq_book_name : 'NA'}
                                                </td>
                                                <td className="border px-2 py-1">
                                                    {el?.maq_page_number || el?.pg_no
                                                        ? el?.maq_page_number || el?.pg_no
                                                        : 'NA'}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export function ExamThemeView({ questionsList, handleEditQuestion, isEdit = true }) {
    if (questionsList.length === 0) return null;
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questionsList[idx]);

    useEffect(() => {
        setCurrentQuestion(questionsList[idx]);
    }, [idx, questionsList]);

    return (
        <>
            {/* Trigger button */}
            <div className="flex justify-center">
                <CButton
                    icon={<FaEye />}
                    disabled={questionsList.length === 0}
                    onClick={() => {
                        dispatch(ModalActions.toggleModal('exam-theme-1-modal'));
                    }}>
                    <span>View</span>
                </CButton>
            </div>

            <CModal
                id="exam-theme-1-modal"
                title={`Exam View`}
                className="!w-[97vw] !h-[97vh] !z-40">
                <div className="container mx-auto p-3 border h-[85vh]">
                    <div className="grid grid-cols-7 gap-6 h-full">
                        {/* Main Question Area */}
                        <div className="col-span-5 flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto pr-2">
                                {/* {topicHeader} */}
                                <QuestionUi q={currentQuestion} idx={idx} />
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex justify-between mt-4">
                                <CButton
                                    disabled={idx === 0}
                                    className="btn--success bg-blue-500 text-white hover:bg-blue-600"
                                    icon={<FaArrowAltCircleLeft />}
                                    onClick={() => setIdx((prev) => prev - 1)}>
                                    Prev
                                </CButton>
                                {isEdit && (
                                    <CButton
                                        icon={<FaPencil />}
                                        onClick={handleEditQuestion.bind(null, currentQuestion.id)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-sm px-4 py-2 rounded">
                                        Edit
                                    </CButton>
                                )}
                                <CButton
                                    disabled={questionsList.length === idx + 1}
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                    icon={<FaArrowAltCircleRight />}
                                    onClick={() => setIdx((prev) => prev + 1)}>
                                    Next
                                </CButton>
                            </div>
                        </div>

                        {/* Question numbers grid */}
                        <div className="col-span-2 border border-blue-200 p-3 overflow-y-auto max-h-full">
                            <div className="grid grid-cols-5 gap-3">
                                {questionsList.map((_q, _i) => (
                                    <div
                                        key={_i}
                                        className={`border rounded-md size-10 flex items-center justify-center cursor-pointer transition ${
                                            idx === _i
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-white hover:bg-gray-100'
                                        }`}
                                        onClick={() => setIdx(_i)}>
                                        {_i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CModal>
        </>
    );
}

function QuestionUi({ idx, q }) {
    return (
        <div className="border p-4 rounded-md shadow-sm bg-gray-50">
            <div className="text-lg mb-3 text-gray-900 flex">
                Q {idx + 1}.{' '}
                <span
                    className="inline-block"
                    dangerouslySetInnerHTML={{
                        __html: q?.q || q?.mqs_question || '-',
                    }}
                />
            </div>

            <div className="pl-4 space-y-2">
                {(q?.q_a || q?.mqs_opt_one) && (
                    <QuestionOption option="A" html={q?.q_a || q?.mqs_opt_one || '-'} />
                )}
                {(q?.q_b || q?.mqs_opt_two) && (
                    <QuestionOption option="B" html={q?.q_b || q?.mqs_opt_two || '-'} />
                )}
                {(q?.q_c || q?.mqs_opt_three) && (
                    <QuestionOption option="C" html={q?.q_c || q?.mqs_opt_three || '-'} />
                )}
                {(q?.q_d || q?.mqs_opt_four) && (
                    <QuestionOption option="D" html={q?.q_d || q?.mqs_opt_four || '-'} />
                )}
                {(q?.q_e || q?.mqs_opt_five) && (
                    <QuestionOption option="E" html={q?.q_e || q?.mqs_opt_five || '-'} />
                )}
            </div>

            <div className="mt-3 text-sm text-gray-700 border-t pt-2 flex justify-center">
                Correct Answer:&nbsp;
                <strong>{q?.q_ans?.toUpperCase() || q?.mqs_ans?.toUpperCase() || '-'}</strong>
            </div>
        </div>
    );
}

function QuestionOption({ option, html }) {
    return (
        <div className="flex gap-2 items-start">
            <span className="font-semibold text-gray-700">{option}.</span>
            <span
                className="inline-block text-gray-800"
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
}

export default QuestionsList;
