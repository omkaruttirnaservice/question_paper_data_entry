import { useState, useRef, useEffect } from 'react'
import { Modal, Button, InputGroup, Form } from 'react-bootstrap'
import { notificationActions } from '../../Store/notification-slice'

import { useDispatch } from 'react-redux'

// CSS IMPORT
import './addQuestionForm.css'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import useHttp from '../Hooks/use-http'
import { useSearchParams, useLocation } from 'react-router-dom'

const AddQuestionForm = ({ isForUpdate }) => {
	// const location = useLocation();
	const searchParams = new URLSearchParams(document.location.search)

	// Extracting query parameters
	const forUpdate = searchParams.get('forUpdate')
	const questionId = searchParams.get('questionId')

	const { sendRequest } = useHttp()

	const subjectNameRef = useRef()
	const topicNameRef = useRef()

	// NOTIFICATION
	const dispatch = useDispatch()

	const [questionNumber, setQuestionNumber] = useState('')

	const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
	const [showAddTopicModal, setShowAddTopicModal] = useState(false)

	const [showNewInputField, setShowNewInputField] = useState(false)

	const [toggleOptions, setToggleOptions] = useState(false)

	const [subjects, setSubjects] = useState([])

	const [topics, setTopics] = useState([])

	const [formData, setFormData] = useState({
		subject_id: '-1',
		topic_id: '-1',

		question_content: '',
		option_A: '',
		option_B: '',
		option_C: '',
		option_D: '',
		option_E: '',
		correct_option: '',
		explanation: '',

		pub_name: '',
		pg_no: '',
	})

	const [questionDetailsToUpdate, setQuestionDetailsToUpdate] = useState({
		subject_id: '-1',
		topic_id: '-1',
		subject_name: '',
		topic_name: '',
		question_content: '',
		option_A: '',
		option_B: '',
		option_C: '',
		option_D: '',
		option_E: '',
		correct_option: '',
		explanation: '',
		pub_name: '',
		pg_no: '',
	})

	useEffect(() => {
		const handleGetQuestionDetails = async (questionId) => {
			const reqDetails = {
				url: `/questions/get-question-details?questionId=${questionId}`,
			}
			sendRequest(reqDetails, (questionData) => {
				const { data } = questionData
				setQuestionDetailsToUpdate(data)
				setFormData({ ...questionDetailsToUpdate })
			})
		}
		handleGetQuestionDetails(questionId)
	}, [forUpdate, questionId])

	const handleChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubjectChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			subject_id: e.target.value,
		}))
	}

	const getSubjectList = async () => {
		let response = await fetch('/get-subject-list')
		let { success, data } = await response.json()

		if (success === 1) {
			setSubjects(data[0])
		}
	}

	useEffect(() => {
		getSubjectList()
	}, [formData.topic_id])

	const getTopicList = async () => {
		const requestData = {
			url: '/get-topic-list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId: formData.subject_id }),
		}
		sendRequest(requestData, (data) => {
			setTopics(data.data)
		})
	}

	useEffect(() => {
		getTopicList()
	}, [formData.subject_id])

	const getQuestionNumber = async () => {
		let response = await fetch('/questions/get-question-number')
		let { data } = await response.json()
		setQuestionNumber(data.total_questions)
	}

	useEffect(() => {
		getQuestionNumber()
	}, [])

	const handleSubjectAdd = async () => {
		let subjectName = subjectNameRef.current.value
		if (subjectName === '') {
			dispatch(
				notificationActions.showNotification('Please enter subject name')
			)
			return
		}

		const requestData = {
			url: '/add-subject',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectName }),
		}
		sendRequest(requestData, (data) => {
			if (data.success === 1) {
				setShowAddSubjectModal(false)
				dispatch(
					notificationActions.showNotification('Subject added successfully')
				)
				getSubjectList()
			} else {
				dispatch(notificationActions.showNotification('Something went wrong'))
			}
		})
	}

	const handleAddTopic = async () => {
		let subjectId = formData.subject_id
		let topicName = topicNameRef.current.value

		if (topicName === '') {
			dispatch(notificationActions.showNotification('Please enter topic name'))
			return
		}

		const requestData = {
			url: '/add-topic',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId, topicName }),
		}
		sendRequest(requestData, (data) => {
			if (data.success === 1) {
				dispatch(
					notificationActions.showNotification('Successfully added new topic')
				)
				setShowAddTopicModal(false)
				getTopicList()
			} else {
				dispatch(notificationActions.showNotification('Something went wrong'))
			}
		})
	}

	const handleUpdateQuestion = async () => {}

	const handleSaveQuestion = async () => {
		checkFormDetailsEmpty(formData, (data) => {
			if (data === true) {
				postQuestionData()
			}
		})
	}

	const checkFormDetailsEmpty = (data, cb) => {
		if (data.subject_id === '-1') {
			dispatch(notificationActions.showNotification(`Please select subject`))
		} else if (data.topic_id === '-1') {
			dispatch(notificationActions.showNotification(`Please select topic`))
		} else if (data.question_content === '') {
			dispatch(notificationActions.showNotification(`Please enter question`))
		} else if (data.option_A === '') {
			dispatch(notificationActions.showNotification(`Please enter option A`))
		} else if (data.option_B === '') {
			dispatch(notificationActions.showNotification(`Please enter option B`))
		} else if (data.option_C === '') {
			dispatch(notificationActions.showNotification(`Please enter option C`))
		} else if (data.option_D === '') {
			dispatch(notificationActions.showNotification(`Please enter option D`))
		} else if (data.correct_option === '') {
			dispatch(
				notificationActions.showNotification(`Please enter correct option`)
			)
		} else {
			cb(true)
		}
	}

	async function postQuestionData() {
		// Send data using Fetch API or any other method
		try {
			let response = await fetch('/questions/add-question', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			let { success, data } = await response.json()
			if (success === 0) {
				throw new Error(data)
			}
			dispatch(
				notificationActions.showNotification('Successfully submitted question')
			)
			setFormData({
				subject_id: '-1', topic_id: '-1', question_content: '', option_A: '',
				option_B: '', option_C: '', option_D: '', option_E: '', correct_option: '',
				explanation: '', pub_name: '', pg_no: '',
			})
		} catch (error) {
			alert(error.message)
		}
	}
	// modals
	const handleAddSubjectModal = () => {
		setShowAddSubjectModal(true)
	}
	const handleTopicAddModal = () => {
		if (formData.subject_id === '-1') {
			dispatch(notificationActions.showNotification('Please select subject.'))
			return
		}
		setShowAddTopicModal(true)
	}
	return (
		<>
			{/* add subject modal  */}
			<Modal
				show={showAddSubjectModal}
				onHide={() => {
					setShowAddSubjectModal(false)
				}}
			>
				<Modal.Header closeButton>
					<Modal.Title>Add subject</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form action="">
						<InputGroup>
							<InputGroup.Text>Subject Name</InputGroup.Text>
							<Form.Control type="text" ref={subjectNameRef} />
						</InputGroup>
						<Button
							className="mt-3"
							variant="primary"
							onClick={handleSubjectAdd}
						>
							Submit
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			{/* add topic modal */}
			<Modal
				show={showAddTopicModal}
				onHide={() => {
					setShowAddTopicModal(false)
				}}
			>
				<Modal.Header closeButton>
					<Modal.Title>Add subject</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<InputGroup>
							<InputGroup.Text>Selected Subject</InputGroup.Text>
							<Form.Control
								type="text"
								value={subjects[formData.subject_id - 1]?.subject_name}
								readOnly
							/>
						</InputGroup>
						<InputGroup className="mt-3">
							<InputGroup.Text>Topic Name</InputGroup.Text>
							<Form.Control type="text" ref={topicNameRef} />
						</InputGroup>
						<Button
							variant="primary"
							className="mt-3"
							type="button"
							onClick={handleAddTopic}
						>
							Submit
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			<div className="container">
				<form id="add-question-form" className="">
					<div className="row g-3">
						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>
									<Button
										className="btn p-0 px-1 btn-secondary btn-sm"
										onClick={handleAddSubjectModal}
									>
										<i className="fa-solid fa-plus"></i>
									</Button>
								</InputGroup.Text>

								<Form.Select
									id="subject-id"
									name="subject_id"
									onChange={handleSubjectChange}
								>
									{forUpdate ? (
										<option value={questionDetailsToUpdate.subject_id}>
											{questionDetailsToUpdate.subject_name}
										</option>
									) : (
										<>
											<option value="-1" className="text-center">
												-- Select Subject --
											</option>
											{subjects?.map((subject, i) => (
												<option key={i} value={subject.id}>
													{subject.subject_name}
												</option>
											))}
										</>
									)}
								</Form.Select>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>
									<Button
										className="btn p-0 px-1 btn-secondary btn-sm"
										onClick={handleTopicAddModal}
									>
										<i className="fa-solid fa-plus"></i>
									</Button>
								</InputGroup.Text>
								<Form.Select name="topic_id" onChange={handleChange}>
									{forUpdate ? (
										<option
											value={questionDetailsToUpdate.topic_id}
											className="text-center"
										>
											{questionDetailsToUpdate.topic_name}
										</option>
									) : (
										<>
											<option value="-1" className="text-center">
												-- Select topic --
											</option>
											{topics?.map((topic, i) => (
												<option key={i} value={topic.id}>
													{topic.topic_name}
												</option>
											))}
										</>
									)}
								</Form.Select>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-6">
							<InputGroup>
								<InputGroup.Text>Pub. Name</InputGroup.Text>
								<Form.Control
									type="text"
									onChange={handleChange}
									name="pub_name"
									value={forUpdate && questionDetailsToUpdate.pub_name}
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-2">
							<InputGroup>
								<InputGroup.Text>Pg No</InputGroup.Text>
								<Form.Control
									type="number"
									onChange={handleChange}
									name="pg_no"
									value={forUpdate && questionDetailsToUpdate.pg_no}
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>Question Number</InputGroup.Text>
								<Form.Control
									value={!forUpdate && questionNumber ? questionNumber + 1 : 0}
									readOnly
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-md-12 mt-4 mb-4">
							<label htmlFor="question-content" className="form-label">
								Enter Question
							</label>
							<CKEditor
								id="question-content"
								name="question_content"
								editor={ClassicEditor}
								onChange={(e, editor) => {
									handleChange({
										target: {
											name: 'question_content',
											value: editor.getData(),
										},
									})
								}}
							/>
						</div>

						<div className="col-md-12">
							<div className="mt-2 d-flex align-items-center gap-2">
								Text Editor{' '}
								<span
									className="toggle-options-editor"
									onClick={() => setToggleOptions(!toggleOptions)}
								>
									{toggleOptions ? (
										<i className="fa-solid fa-toggle-on text-success"></i>
									) : (
										<i className="fa-solid fa-toggle-off"></i>
									)}
								</span>
							</div>
							<div className="form-options">
								{['A', 'B', 'C', 'D'].map((option) => (
									<div key={option}>
										<label htmlFor={`option-${option}`}>{option}</label>
										{toggleOptions ? (
											<div className="ckeditor">
												<CKEditor
													id={`option-${option}`}
													editor={ClassicEditor}
													onChange={(e, editor) =>
														handleChange({
															target: {
																name: `option_${option}`,
																value: editor.getData(),
															},
														})
													}
													data={formData[`option_${option}`]}
												/>
											</div>
										) : (
											<textarea
												type="text"
												className="form-control"
												id={`option-${option}`}
												name={`option_${option}`}
												onChange={handleChange}
												value={formData[`option_${option}`]}
											>
												{formData[`option_${option}`]}
											</textarea>
										)}
									</div>
								))}

								{showNewInputField ? (
									<>
										<div className="">
											<label htmlFor="option-E">E</label>
											{toggleOptions ? (
												<div className="ckeditor">
													<CKEditor
														id={`option-E`}
														editor={ClassicEditor}
														onChange={(e, editor) =>
															handleChange({
																target: {
																	name: `option_E`,
																	value: editor.getData(),
																},
															})
														}
														data={formData[`option_E`]}
													/>
												</div>
											) : (
												<textarea
													type="text"
													className="form-control"
													id={`option-E`}
													name={`option_E`}
													onChange={(e) => handleChange(e)}
													value={formData[`option_E`]}
												>
													{formData[`option_E`]}
												</textarea>
											)}
										</div>
										<button
											className="btn btn-danger"
											id="remove-new-option-btn"
											onClick={() => setShowNewInputField(!showNewInputField)}
										>
											Remove
										</button>
									</>
								) : (
									<button
										className="btn btn-secondary"
										id="add-new-option-btn"
										onClick={() => setShowNewInputField(!showNewInputField)}
									>
										Add option
									</button>
								)}
							</div>
						</div>
						<div className="col-md-3">
							<InputGroup>
								<InputGroup.Text>Correct Option</InputGroup.Text>
								<Form.Control
									type="text"
									id="correct-option"
									className="text-uppercase"
									name="correct_option"
									onChange={handleChange}
									value={formData.correct_option}
									maxLength="1"
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-md-12 mt-3">
							<div
								className="accordion accordion-flush"
								id="add-explanation-accordion"
							>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#accordion-target-explanation"
											aria-expanded="true"
											aria-controls="accordion-target-explanation"
										>
											Add Explanation
										</button>
									</h2>
									<div
										id="accordion-target-explanation"
										className="accordion-collapse collapse show"
										data-bs-parent="#add-explanation-accordion"
									>
										<div className="accordion-body">
											<CKEditor
												id={``}
												editor={ClassicEditor}
												onChange={(e, editor) =>
													handleChange({
														target: {
															name: `explantion`,
															value: editor.getData(),
														},
													})
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{forUpdate == 'true' ? (
						<button
							type="button"
							className="btn btn-success mt-2"
							id="update-question-btn"
							onClick={handleUpdateQuestion}
						>
							Update
						</button>
					) : (
						<button
							type="button"
							className="btn btn-primary mt-2"
							id="save-new-question-btn"
							onClick={handleSaveQuestion}
						>
							Save
						</button>
					)}
				</form>
			</div>
		</>
	)
}

export default AddQuestionForm
