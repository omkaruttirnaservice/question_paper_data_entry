import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.jsx';
import CButton from './CButton.jsx';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CModal({ id, children, title, showCloseBtn = true, className = '' }) {
    const _modalSlice = useSelector((state) => state.modal);

    function _isModalOpen(key) {
        return !!_modalSlice[key];
    }

    useEffect(() => {
        if (_isModalOpen(id)) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup when modal unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [_isModalOpen(id)]);

    if (!_isModalOpen(id)) return null;

    return createPortal(
        <>
            <ModalBackdrop />
            <div className={`fixed inset-0 z-[110] flex items-center justify-center pointer-events-none p-4 transition-all duration-300 ${_isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div
                    className={`bg-white pointer-events-auto overflow-y-auto shadow-2xl rounded-2xl border border-gray-100 min-h-[10rem] max-h-[95vh] transition-transform duration-300 ${_isModalOpen
                            ? `scale-100`
                            : `scale-95`
                        } 
						p-6 min-w-[40vw] w-auto max-w-[98vw]
						${className}
						`}>
                    <ModalHeader id={id} showCloseBtn={showCloseBtn}>
                        {title}
                    </ModalHeader>

                    <div className="pt-2">{children}</div>
                </div>
            </div>
        </>,
        document.body
    );
}

export function ModalBackdrop() {
    return (
        <div className="fixed inset-0 z-[100] h-screen w-screen bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
    );
}

export function ModalTitle({ children }) {
    return <p>{children}</p>;
}

export function ModalHeader({ children, id, showCloseBtn }) {
    return (
        <div className="border-b border-gray-100 flex justify-between items-center pb-4 mb-2">
            <h3 className="text-xl font-semibold text-gray-800 m-0">{children}</h3>
            {showCloseBtn && <ModalCloseBtn id={id} showCloseBtn={showCloseBtn} />}
        </div>
    );
}

export function ModalCloseBtn({ id }) {
    const dispatch = useDispatch();
    return (
        <button
            type="button"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => {
                dispatch(ModalActions.toggleModal(id));
            }}>
            <IoClose size={24} />
        </button>
    );
}
