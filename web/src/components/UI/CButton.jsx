import { AiOutlineLoading3Quarters } from 'react-icons/ai';
export default function CButton({
    children,
    className,
    onClick,
    icon,
    type = 'button',
    varient = 'btn--primary',
    isLoading = false,
    disabled = false,
}) {
    return (
        <>
            <button
                className={`cd-btn flex items-center gap-1 ${className} ${varient}  disabled:cursor-not-allowed  disabled:bg-gray-400 disabled:hover:cursor-wait`}
                type={type}
                onClick={onClick}
                disabled={isLoading}>
                <span className="flex items-center gap-2">
                    {children} {!icon ? '' : icon}
                </span>
                {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
            </button>
        </>
    );
}
