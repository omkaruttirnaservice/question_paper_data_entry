import * as Yup from 'yup';

const editQuestionFormSchema = Yup.object().shape({
    mqs_question: Yup.string().required('Enter question'),
    mqs_opt_one: Yup.string().required('Enter option A'),
    mqs_opt_two: Yup.string().required('Enter option B'),
    mqs_opt_three: Yup.string().required('Enter option C'),
    mqs_opt_four: Yup.string().required('Enter option D'),
    mqs_ans: Yup.string().required('Enter correct option'),
});
export default editQuestionFormSchema;
