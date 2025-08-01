import Cookies from 'js-cookie';
export const getCookie = (name) => Cookies.get(name);

export const resetCkEditorInstances = () => {
    const fields = [
        'mqs_question',
        'mqs_opt_one',
        'mqs_opt_two',
        'mqs_opt_three',
        'mqs_opt_four',
        'mqs_opt_five',
        'mqs_solution',
    ];

    fields.forEach((field) => {
        if (window.CKEDITOR.instances[field]) {
            window.CKEDITOR.instances[field].setData('');
        }
    });
};
