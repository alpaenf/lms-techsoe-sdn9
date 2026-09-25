export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 text-[#800020] shadow-sm focus:ring-[#800020] ' +
                className
            }
        />
    );
}
