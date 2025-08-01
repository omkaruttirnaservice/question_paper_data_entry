import * as Yup from 'yup';

const addQuestionFormSchema = Yup.object().shape({
    post_id: Yup.string().required('Select Post'),
    subject_id: Yup.number().required('Select subject'),
    topic_id: Yup.number().required('Select topic'),
    // pub_name: Yup.string().required('Enter publication name'),
    // book_name: Yup.string().when('pub_name', {
    // 	is: (pub_name) => pub_name && pub_name.length > 0,
    // 	then: Yup.string().required('Enter book name'),
    // }),
    // pg_no: Yup.string().when('pub_name', {
    // 	is: (pub_name) => pub_name && pub_name.length > 0,
    // 	then: Yup.string().required('Page number is required'),
    // }),
    mqs_question: Yup.string().required('Enter question'),
    mqs_opt_one: Yup.string().required('Enter option A'),
    mqs_opt_two: Yup.string().required('Enter option B'),
    mqs_opt_three: Yup.string().required('Enter option C'),
    mqs_opt_four: Yup.string().required('Enter option D'),

    mqs_ans: Yup.string().required('Enter correct option'),
});
export default addQuestionFormSchema;
