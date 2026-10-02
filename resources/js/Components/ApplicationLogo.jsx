export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/logo.webp"
            alt="Logo UPT SDN 9 Gandangbatu Sillanan"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
