import { IoGridOutline } from 'react-icons/io5';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

import { useEffect, useState } from 'react';
import { FaEdit, FaGripLinesVertical, FaListUl, FaPrint } from 'react-icons/fa';

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
                    QuestionFormActions.setQuestionsList(questionsList.filter((el) => el.id != id))
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

    const [listMode, setListMode] = useState(true);
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
                            onClick={toggleListMode.bind(null, true)}
                            className={`${
                                listMode ? 'bg-gray-200' : 'bg-white'
                            } p-3 cursor-pointer`}>
                            <FaListUl className="" />
                        </div>
                        <div
                            onClick={toggleListMode.bind(null, false)}
                            className={`${
                                !listMode ? 'bg-gray-200' : 'bg-white'
                            } p-3 cursor-pointer`}>
                            <IoGridOutline />
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

                {questionsList.length > 0 && listMode && (
                    <QuestionsListAccordion
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
                    />
                )}

                {questionsList.length > 0 && !listMode && (
                    <QuestionsListIEEFormat
                        questionsList={questionsList}
                        handleEditQuestion={handleEditQuestion}
                        handleDeleteQuestion={handleDeleteQuestion}
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

export default QuestionsList;
