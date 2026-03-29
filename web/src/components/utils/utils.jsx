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

export const populateCkEditorFromExcel = (row) => {
    setTimeout(() => {
        const setEditor = (id, val) => {
            if (window.CKEDITOR && window.CKEDITOR.instances[id]) {
                window.CKEDITOR.instances[id].setData(val || '');
            }
        };
        setEditor('mqs_question', row.q);
        setEditor('mqs_opt_one', row.q_a);
        setEditor('mqs_opt_two', row.q_b);
        setEditor('mqs_opt_three', row.q_c);
        setEditor('mqs_opt_four', row.q_d);

        // If q_e exist, it might take a moment to mount the editor 
        if (row.q_e !== undefined) {
            setTimeout(() => setEditor('mqs_opt_five', row.q_e), 250);
        }
    }, 100);
};

export const isDevEnv = () =>
    import.meta.env.VITE_ENV === 'dev' || import.meta.env.VITE_ENV === 'development';
